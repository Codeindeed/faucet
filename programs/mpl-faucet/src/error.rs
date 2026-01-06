use num_derive::FromPrimitive;
use solana_program::{
    decode_error::DecodeError,
    msg,
    program_error::{PrintProgramError, ProgramError},
};
use thiserror::Error;

#[derive(Error, Clone, Debug, Eq, PartialEq, FromPrimitive)]
pub enum MplFaucetError {
    /// 0 - Invalid System Program
    #[error("Invalid System Program")]
    InvalidSystemProgram,
    /// 1 - Error deserializing account
    #[error("Error deserializing account")]
    DeserializationError,
    /// 2 - Error serializing account
    #[error("Error serializing account")]
    SerializationError,
    /// 3 - Insufficient treasury balance
    #[error("Insufficient treasury balance")]
    InsufficientTreasuryBalance,
    /// 4 - Invalid treasury PDA
    #[error("Invalid treasury PDA")]
    InvalidTreasuryPda,
    /// 5 - Invalid MPL Core program
    #[error("Invalid MPL Core program")]
    InvalidMplCoreProgram,
    /// 6 - Invalid Bubblegum program
    #[error("Invalid Bubblegum program")]
    InvalidBubblegumProgram,
    /// 7 - Invalid proof derivation
    #[error("Invalid proof derivation")]
    InvalidProofDerivation,
}

impl PrintProgramError for MplFaucetError {
    fn print<E>(&self) {
        msg!(&self.to_string());
    }
}

impl From<MplFaucetError> for ProgramError {
    fn from(e: MplFaucetError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

impl<T> DecodeError<T> for MplFaucetError {
    fn type_of() -> &'static str {
        "Mpl Faucet Error"
    }
}
