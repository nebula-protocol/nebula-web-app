import { u, NEB } from '../tokens';
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
    amount: u<NEB>;
    proof: string[];
  }

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Config {
    config: {};
  }

  export interface ConfigResponse {
    owner: HumanAddr;
    // TODO is this CW20Addr or HumanAddr?
    nebula_token: CW20Addr;
  }

  export interface MerkleRoot {
    merkle_root: {
      stage: rs.u8;
    };
  }

  export interface MerkleRootResponse {
    stage: rs.u8;
    merkle_root: string;
  }

  export interface LatestStage {
    latest_stage: {};
  }

  export interface LatestStageResponse {
    latest_stage: rs.u8;
  }

  export interface IsClaimed {
    is_claimed: {
      stage: rs.u8;
      address: HumanAddr;
    };
  }

  export interface IsClaimedResponse {
    is_claimed: boolean;
  }
}
