use borsh::{BorshDeserialize, BorshSerialize};
use shank::ShankAccount;
use solana_program::{native_token::LAMPORTS_PER_SOL, pubkey, pubkey::Pubkey};

/// Seed for deriving the treasury PDA
pub const TREASURY_SEED: &[u8] = b"treasury";

pub const TREASURY_PDA: Pubkey = pubkey!("H4cUXkHgBzavjvxregchEaZ6CdkynhhR59oiMRxFziEU");
pub const TREASURY_BUMP: u8 = 255;

// The base reward that the challenge number is multiplied by to get the reward.
pub const BASE_REWARD: u64 = LAMPORTS_PER_SOL;

/// Find the treasury PDA address and bump
pub fn find_treasury_pda(program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[TREASURY_SEED], program_id)
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, ShankAccount)]
pub struct Proof {
    pub is_solved: bool,
}
