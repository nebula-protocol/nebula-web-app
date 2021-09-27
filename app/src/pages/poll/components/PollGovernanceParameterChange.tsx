import { microfy } from '@libs/formatter';
import { InputAdornment } from '@material-ui/core';
import { useNebulaApp } from '@nebula-js/app-provider';
import { gov, NEB, Num, rs, u } from '@nebula-js/types';
import { FormLabel, NumberInput } from '@nebula-js/ui';
import React, { useCallback, useState } from 'react';
import { PollCreateBase } from './PollCreateBase';

export default function PollGovernanceParameterChange() {
  const { contractAddress } = useNebulaApp();

  const [votingPeriod, setVotingPeriod] = useState<Num>('' as Num);
  const [effectiveDelay, setEffectiveDelay] = useState<Num>('' as Num);
  const [proposalDeposit, setProposalDeposit] = useState<NEB>('' as NEB);
  const [voterWeight, setVoterWeight] = useState<rs.Decimal>('' as rs.Decimal);
  const [quorum, setQuorum] = useState<rs.Decimal>('' as rs.Decimal);

  const invalidVotingPeriod = undefined;
  const invalidEffectiveDelay = undefined;
  const invalidProposalDeposit = undefined;
  const invalidVoterWeight = undefined;
  const invalidQuorum = undefined;

  const createMsg = useCallback(() => {
    const govUpdateConfig: gov.UpdateConfig = {
      update_config: {},
    };

    if (votingPeriod.length > 0) {
      govUpdateConfig.update_config.voting_period = parseInt(votingPeriod);
    }

    if (effectiveDelay.length > 0) {
      govUpdateConfig.update_config.effective_delay = parseInt(effectiveDelay);
    }

    if (proposalDeposit.length > 0) {
      govUpdateConfig.update_config.proposal_deposit = microfy(
        proposalDeposit,
      ).toFixed() as u<NEB>;
    }

    if (voterWeight.length > 0) {
      govUpdateConfig.update_config.voter_weight = voterWeight;
    }

    if (quorum.length > 0) {
      govUpdateConfig.update_config.quorum = quorum;
    }

    const executeMsg: gov.ExecuteMsg = {
      contract: contractAddress.gov,
      msg: Buffer.from(JSON.stringify(govUpdateConfig)).toString('base64'),
    };

    return executeMsg;
  }, [
    contractAddress.gov,
    effectiveDelay,
    proposalDeposit,
    quorum,
    voterWeight,
    votingPeriod,
  ]);

  return (
    <PollCreateBase
      title="Governance Parameter Change"
      description="Modify parameters of an existing cluster"
      onCreateMsg={createMsg}
      submitButtonStatus={
        (votingPeriod.length > 0 ||
          effectiveDelay.length > 0 ||
          proposalDeposit.length > 0 ||
          voterWeight.length > 0 ||
          quorum.length > 0) &&
        !invalidVotingPeriod &&
        !invalidEffectiveDelay &&
        !invalidProposalDeposit &&
        !invalidVoterWeight &&
        !invalidQuorum
          ? true
          : 'disabled'
      }
    >
      <FormLabel label="Voting Period" className="form-label">
        <NumberInput<Num>
          maxIntegerPoints={14}
          maxDecimalPoints={0}
          placeholder="0"
          fullWidth
          value={votingPeriod}
          onChange={setVotingPeriod}
          error={!!invalidVotingPeriod}
          helperText={invalidVotingPeriod}
        />
      </FormLabel>

      <FormLabel label="Effective Delay" className="form-label">
        <NumberInput<Num>
          maxIntegerPoints={14}
          maxDecimalPoints={0}
          placeholder="0"
          fullWidth
          value={effectiveDelay}
          onChange={setEffectiveDelay}
          error={!!invalidEffectiveDelay}
          helperText={invalidEffectiveDelay}
        />
      </FormLabel>

      <FormLabel label="NEB Deposit Amount" className="form-label">
        <NumberInput<NEB>
          maxIntegerPoints={14}
          maxDecimalPoints={6}
          placeholder="0.00"
          fullWidth
          value={proposalDeposit}
          onChange={setProposalDeposit}
          error={!!invalidProposalDeposit}
          helperText={invalidProposalDeposit}
          InputProps={{
            endAdornment: <InputAdornment position="end">NEB</InputAdornment>,
          }}
        />
      </FormLabel>

      <FormLabel label="Voter Reward Weight" className="form-label">
        <NumberInput<rs.Decimal>
          maxIntegerPoints={14}
          maxDecimalPoints={6}
          placeholder="0.00"
          fullWidth
          value={voterWeight}
          onChange={setVoterWeight}
          error={!!invalidVoterWeight}
          helperText={invalidVoterWeight}
        />
      </FormLabel>

      <FormLabel label="Quorum" className="form-label">
        <NumberInput<rs.Decimal>
          maxIntegerPoints={14}
          maxDecimalPoints={6}
          placeholder="0.00"
          fullWidth
          value={quorum}
          onChange={setQuorum}
          error={!!invalidQuorum}
          helperText={invalidQuorum}
        />
      </FormLabel>
    </PollCreateBase>
  );
}
