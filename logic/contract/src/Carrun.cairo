#[starknet::interface]
pub trait ICarrun<TContractState> {
    fn getHighScore(self: @TContractState) -> u256;
    fn addHighScore(ref self: TContractState, score: u256) -> u256;
}

#[starknet::contract]
mod Carrun {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        x: u256
    }

    #[abi(embed_v0)]
    impl CarrunImpl of super::ICarrun<ContractState> {
        fn getHighScore(self: @ContractState) -> u256 {
            self.x.read()
        }

        fn addHighScore(ref self: ContractState, score: u256) -> u256 {
            let current_high_score = self.x.read();
            if (score > current_high_score) {
                self.x.write(score);
                return score;
            }
            return current_high_score;
        }
    }
}