import { uCT } from '../tokens';
import { HumanAddr } from './common';

export namespace airdrop {
  export interface Config {}

  export interface ConfigResponse {
    owner: HumanAddr;
    nebula_token: HumanAddr;
  }

  export interface MerkleRoot {
    stage: number;
  }

  export interface MerkleRootResponse {
    stage: number;
    merkle_root: string;
  }

  export interface LatestStage {}

  export interface LatestStageResponse {
    latest_stage: number;
  }

  export interface IsClaimed {
    stage: number;
    address: HumanAddr;
  }

  export interface IsClaimedResponse {
    is_claimed: boolean;
  }

  // TODO
  export interface SomeExample {
    address: HumanAddr;
  }

  export interface SomeExampleResponse {
    balance: uCT;
  }
}
