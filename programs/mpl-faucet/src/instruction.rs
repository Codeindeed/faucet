use borsh::{BorshDeserialize, BorshSerialize};
use shank::{ShankContext, ShankInstruction};

/// Reward amount for burning a Bubblegum V2 cNFT (1 SOL)
pub const BUBBLEGUM_V2_REWARD: u64 = 1_000_000_000;

#[derive(BorshDeserialize, BorshSerialize, Clone, Debug, ShankContext, ShankInstruction)]
#[rustfmt::skip]
pub enum MplFaucetInstruction {
    /// Burns a Metaplex Core asset and rewards 0.1 SOL from treasury.
    #[account(0, writable, name="asset", desc = "The Core asset to burn")]
    #[account(1, optional, writable, name="collection", desc = "The collection the asset belongs to (if any)")]
    #[account(2, writable, signer, name="owner", desc = "The owner of the asset (receives SOL reward)")]
    #[account(3, writable, name="proof", desc = "The proof of challenge 0 completion")]
    #[account(4, writable, name="treasury", desc = "The treasury PDA that holds SOL rewards")]
    #[account(5, name="mpl_core_program", desc = "The MPL Core program")]
    #[account(6, name="system_program", desc = "The system program")]
    Challenge0,

    /// Burns a Metaplex Core asset and rewards 0.1 SOL from treasury.
    #[account(0, writable, name="asset", desc = "The Core asset to burn")]
    #[account(1, optional, writable, name="collection", desc = "The collection the asset belongs to (if any)")]
    #[account(2, writable, signer, name="owner", desc = "The owner of the asset (receives SOL reward)")]
    #[account(3, writable, name="proof", desc = "The proof of challenge 0 completion")]
    #[account(4, writable, name="treasury", desc = "The treasury PDA that holds SOL rewards")]
    #[account(5, name="mpl_core_program", desc = "The MPL Core program")]
    #[account(6, name="system_program", desc = "The system program")]
    Challenge1,

    /// Burns a Metaplex Core asset and rewards 0.1 SOL from treasury.
    #[account(0, writable, name="asset", desc = "The Core asset to burn")]
    #[account(1, optional, writable, name="collection", desc = "The collection the asset belongs to (if any)")]
    #[account(2, writable, signer, name="owner", desc = "The owner of the asset (receives SOL reward)")]
    #[account(3, writable, name="proof", desc = "The proof of challenge 0 completion")]
    #[account(4, writable, name="treasury", desc = "The treasury PDA that holds SOL rewards")]
    #[account(5, name="mpl_core_program", desc = "The MPL Core program")]
    #[account(6, name="system_program", desc = "The system program")]
    Challenge2,

    /// Burns a Metaplex Core asset and rewards 0.1 SOL from treasury.
    #[account(0, writable, name="asset", desc = "The Core asset to burn")]
    #[account(1, optional, writable, name="collection", desc = "The collection the asset belongs to (if any)")]
    #[account(2, writable, signer, name="owner", desc = "The owner of the asset (receives SOL reward)")]
    #[account(3, writable, name="proof", desc = "The proof of challenge 0 completion")]
    #[account(4, writable, name="treasury", desc = "The treasury PDA that holds SOL rewards")]
    #[account(5, name="mpl_core_program", desc = "The MPL Core program")]
    #[account(6, name="system_program", desc = "The system program")]
    Challenge3,

    /// Burns a Metaplex Core asset and rewards 0.1 SOL from treasury.
    #[account(0, writable, name="asset", desc = "The Core asset to burn")]
    #[account(1, optional, writable, name="collection", desc = "The collection the asset belongs to (if any)")]
    #[account(2, writable, signer, name="owner", desc = "The owner of the asset (receives SOL reward)")]
    #[account(3, writable, name="proof", desc = "The proof of challenge 0 completion")]
    #[account(4, writable, name="treasury", desc = "The treasury PDA that holds SOL rewards")]
    #[account(5, name="mpl_core_program", desc = "The MPL Core program")]
    #[account(6, name="system_program", desc = "The system program")]
    Challenge4,

    /// Burns a Bubblegum V2 compressed NFT and rewards 1 SOL from treasury.
    #[account(0, writable, name="tree_config", desc = "The tree configuration account")]
    #[account(1, writable, name="merkle_tree", desc = "The merkle tree account")]
    #[account(2, writable, signer, name="leaf_owner", desc = "The owner of the cNFT (receives SOL reward)")]
    #[account(3, optional, name="leaf_delegate", desc = "The delegate of the cNFT (defaults to leaf_owner)")]
    #[account(4, writable, name="treasury", desc = "The treasury PDA that holds SOL rewards")]
    #[account(5, optional, writable, name="collection", desc = "The Core collection (if cNFT is part of one)")]
    #[account(6, name="bubblegum_program", desc = "The Bubblegum V2 program")]
    #[account(7, name="compression_program", desc = "The SPL Account Compression program")]
    #[account(8, optional, name="mpl_core_program", desc = "The MPL Core program (for collection operations)")]
    #[account(9, name="system_program", desc = "The system program")]
    #[account(10, name="log_wrapper", desc = "The SPL Noop program")]
    BurnBubblegumV2Asset(BurnBubblegumV2AssetArgs),
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Debug, Clone)]
pub struct BurnBubblegumV2AssetArgs {
    /// The merkle root
    pub root: [u8; 32],
    /// The data hash of the leaf
    pub data_hash: [u8; 32],
    /// The creator hash of the leaf
    pub creator_hash: [u8; 32],
    /// The nonce/leaf index
    pub nonce: u64,
    /// The index of the leaf in the tree
    pub index: u32,
}
