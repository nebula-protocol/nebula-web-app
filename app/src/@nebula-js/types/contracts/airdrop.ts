import { uNEB } from '../tokens';
import { CW20Addr, HumanAddr, rs } from './common';

export namespace airdrop {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface UpdateConfig {
    owner?: HumanAddr;
  }

  export interface UpdateMerkleRoot {
    stage: rs.u8;
    // TODO is this can be a nominal type?
    merkle_root: string;
  }

  export interface RegisterMerkleRoot {
    merkle_root: string;
  }

  export interface Claim {
    stage: rs.u8;
    // TODO is this NEB or not?
    amount: uNEB;
    proof: string[];
  }

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Config {}

  export interface ConfigResponse {
    owner: HumanAddr;
    // TODO is this CW20Addr or HumanAddr?
    nebula_token: CW20Addr;
  }

  export interface MerkleRoot {
    stage: rs.u8;
  }

  export interface MerkleRootResponse {
    stage: rs.u8;
    merkle_root: string;
  }

  export interface LatestStage {}

  export interface LatestStageResponse {
    latest_stage: rs.u8;
  }

  export interface IsClaimed {
    stage: rs.u8;
    address: HumanAddr;
  }

  export interface IsClaimedResponse {
    is_claimed: boolean;
  }
}
