use borsh::BorshDeserialize;
use mpl_core::accounts::BaseAssetV1;
use mpl_core::types::{
    Attributes, Edition, ExternalPluginAdapterKey, LinkedDataKey, PluginAuthority, PluginType,
};
use mpl_core::{
    fetch_asset_plugin, fetch_external_plugin_adapter, fetch_wrapped_external_plugin_adapter,
    DataBlob, SolanaAccount,
};
use mpl_utils::{assert_derivation, create_or_allocate_account_raw};
use solana_program::program::invoke_signed;
use solana_program::system_instruction;
use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, msg, pubkey::Pubkey};

use crate::error::MplFaucetError;
use crate::instruction::{
    accounts::{BurnBubblegumV2AssetAccounts, Challenge0Accounts},
    BurnBubblegumV2AssetArgs, MplFaucetInstruction, BUBBLEGUM_V2_REWARD,
};
use crate::state::{BASE_REWARD, TREASURY_BUMP, TREASURY_PDA};

pub fn process_instruction<'a>(
    _program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction: MplFaucetInstruction = MplFaucetInstruction::try_from_slice(instruction_data)?;
    match instruction {
        MplFaucetInstruction::Challenge0 => {
            msg!("Instruction: Challenge0");
            burn_core_asset::<BaseAssetV1>(accounts, 0, None, None)
        }
        MplFaucetInstruction::Challenge1 => {
            msg!("Instruction: Challenge1");
            burn_core_asset::<Attributes>(accounts, 1, Some(PluginType::Attributes), None)
        }
        MplFaucetInstruction::Challenge2 => {
            msg!("Instruction: Challenge2");
            burn_core_asset::<Edition>(accounts, 2, Some(PluginType::Edition), None)
        }
        MplFaucetInstruction::Challenge3 => {
            msg!("Instruction: Challenge3");
            burn_core_asset::<BaseAssetV1>(
                accounts,
                3,
                None,
                Some(ExternalPluginAdapterKey::AppData(
                    PluginAuthority::UpdateAuthority,
                )),
            )
        }
        MplFaucetInstruction::Challenge4 => {
            msg!("Instruction: Challenge4");
            burn_core_asset::<BaseAssetV1>(
                accounts,
                4,
                None,
                Some(ExternalPluginAdapterKey::DataSection(
                    LinkedDataKey::LinkedAppData(PluginAuthority::UpdateAuthority),
                )),
            )
        }
        MplFaucetInstruction::BurnBubblegumV2Asset(args) => {
            msg!("Instruction: BurnBubblegumV2Asset");
            burn_bubblegum_v2_asset(accounts, args)
        }
    }
}

fn burn_core_asset<'a, Plugin: BorshDeserialize>(
    accounts: &'a [AccountInfo<'a>],
    challenge_number: u8,
    plugin_type: Option<PluginType>,
    external_plugin_type: Option<ExternalPluginAdapterKey>,
) -> ProgramResult {
    // Parse accounts
    let ctx = Challenge0Accounts::context(accounts)?;

    // Validate proof
    let proof_bump = assert_derivation(
        &crate::ID,
        ctx.accounts.proof,
        &[
            b"proof",
            &[challenge_number],
            ctx.accounts.owner.key.as_ref(),
        ],
        MplFaucetError::InvalidProofDerivation,
    )?;

    // Validate treasury PDA
    if *ctx.accounts.treasury.key != TREASURY_PDA {
        return Err(MplFaucetError::InvalidTreasuryPda.into());
    }

    // Validate MPL Core program
    if *ctx.accounts.mpl_core_program.key != mpl_core::ID {
        return Err(MplFaucetError::InvalidMplCoreProgram.into());
    }

    // Check treasury has sufficient balance
    let reward = BASE_REWARD * (challenge_number + 1) as u64;
    if ctx.accounts.treasury.lamports() < reward {
        return Err(MplFaucetError::InsufficientTreasuryBalance.into());
    }

    // Check for the specified plugin
    if let Some(plugin_type) = plugin_type {
        // If the plugin isn't found, the instruction will fail with an error.
        let _ = fetch_asset_plugin::<Plugin>(ctx.accounts.asset, plugin_type)?;
    }

    // Check for the specified external plugin
    if let Some(external_plugin_type) = external_plugin_type {
        // If the plugin isn't found, the instruction will fail with an error.
        let _ = fetch_wrapped_external_plugin_adapter::<BaseAssetV1>(
            ctx.accounts.asset,
            None,
            &external_plugin_type,
        )?;
    }

    // CPI to MPL Core to burn the asset
    // TODO: Verify CPI builder interface matches mpl-core version
    let mut burn_builder =
        mpl_core::instructions::BurnV1CpiBuilder::new(ctx.accounts.mpl_core_program);
    burn_builder
        .asset(ctx.accounts.asset)
        .payer(ctx.accounts.owner)
        .authority(Some(ctx.accounts.owner));

    if let Some(collection) = ctx.accounts.collection {
        burn_builder.collection(Some(collection));
    }

    burn_builder.invoke()?;

    // Transfer SOL reward from treasury to owner
    // Since treasury is program-owned, we can directly modify lamports
    invoke_signed(
        &system_instruction::transfer(ctx.accounts.treasury.key, ctx.accounts.owner.key, reward),
        &[ctx.accounts.treasury.clone(), ctx.accounts.owner.clone()],
        &[&[b"treasury", &[TREASURY_BUMP]]],
    )?;

    // Write proof to proof account
    create_or_allocate_account_raw(
        crate::ID,
        ctx.accounts.proof,
        ctx.accounts.system_program,
        ctx.accounts.owner,
        1,
        &[
            b"proof",
            &[challenge_number],
            ctx.accounts.owner.key.as_ref(),
            &proof_bump.to_le_bytes(),
        ],
    )?;

    // Write a value to keep it open
    ctx.accounts.proof.try_borrow_mut_data()?[0] = 1;

    msg!("Burned Core asset and rewarded {} lamports", reward);

    Ok(())
}

fn burn_bubblegum_v2_asset<'a>(
    accounts: &'a [AccountInfo<'a>],
    args: BurnBubblegumV2AssetArgs,
) -> ProgramResult {
    // Parse accounts
    let ctx = BurnBubblegumV2AssetAccounts::context(accounts)?;

    // Validate treasury PDA
    if *ctx.accounts.treasury.key != TREASURY_PDA {
        return Err(MplFaucetError::InvalidTreasuryPda.into());
    }

    // Validate Bubblegum program
    if *ctx.accounts.bubblegum_program.key != mpl_bubblegum::ID {
        return Err(MplFaucetError::InvalidBubblegumProgram.into());
    }

    // Check treasury has sufficient balance
    let reward = BUBBLEGUM_V2_REWARD;
    if ctx.accounts.treasury.lamports() < reward {
        return Err(MplFaucetError::InsufficientTreasuryBalance.into());
    }

    // CPI to Bubblegum V2 to burn the compressed NFT
    // TODO: Verify CPI builder interface matches mpl-bubblegum version
    let mut burn_builder =
        mpl_bubblegum::instructions::BurnV2CpiBuilder::new(ctx.accounts.bubblegum_program);
    burn_builder
        .tree_config(ctx.accounts.tree_config)
        .merkle_tree(ctx.accounts.merkle_tree)
        .leaf_owner(ctx.accounts.leaf_owner)
        .payer(ctx.accounts.leaf_owner)
        .log_wrapper(ctx.accounts.log_wrapper)
        .compression_program(ctx.accounts.compression_program)
        .system_program(ctx.accounts.system_program)
        .root(args.root)
        .data_hash(args.data_hash)
        .creator_hash(args.creator_hash)
        .nonce(args.nonce)
        .index(args.index);

    if let Some(leaf_delegate) = ctx.accounts.leaf_delegate {
        burn_builder.leaf_delegate(Some(leaf_delegate));
    }

    if let Some(collection) = ctx.accounts.collection {
        burn_builder.core_collection(Some(collection));
    }

    burn_builder.invoke()?;

    // Transfer SOL reward from treasury to leaf_owner
    **ctx.accounts.treasury.try_borrow_mut_lamports()? -= reward;
    **ctx.accounts.leaf_owner.try_borrow_mut_lamports()? += reward;

    msg!("Burned Bubblegum V2 cNFT and rewarded {} lamports", reward);

    Ok(())
}
