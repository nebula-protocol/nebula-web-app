import { InputAdornment } from '@material-ui/core';
import { WalletIcon } from '@nebula-js/icons';
import { formatUInput, formatUToken, microfy } from '@nebula-js/notation';
import { community, gov, HumanAddr, NEB, u } from '@nebula-js/types';
import {
  FormLabel,
  FormLabelAside,
  NumberInput,
  TextInput,
} from '@nebula-js/ui';
import {
  useCW20BalanceQuery,
  useNebulaWebapp,
} from '@nebula-js/webapp-provider';
import { AccAddress } from '@terra-money/terra.js';
import React, { useCallback, useMemo, useState } from 'react';
import { PollCreateBase } from './PollCreateBase';

export default function PollCommunityPoolSpend() {
  const { contractAddress } = useNebulaWebapp();

  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<NEB>('' as NEB);

  const { data: { tokenBalance: communityNebBalance } = {} } =
    useCW20BalanceQuery<NEB>(
      contractAddress.cw20.NEB,
      contractAddress.community,
    );

  const invalidAmount = useMemo(() => {
    if (amount.length === 0 || !communityNebBalance) {
      return undefined;
    }

    const uneb = microfy(amount as NEB);

    return uneb.gt(communityNebBalance.balance)
      ? 'Spending Limit Exceeded'
      : undefined;
  }, [amount, communityNebBalance]);

  const invalidRecipient = useMemo(() => {
    if (recipient.length === 0) {
      return undefined;
    }

    return !AccAddress.validate(recipient) ? 'Invalid address' : undefined;
  }, [recipient]);

  const createMsg = useCallback(() => {
    const communitySpend: community.Spend = {
      spend: {
        recipient: recipient as HumanAddr,
        amount: microfy(amount) as u<NEB>,
      },
    };

    const executeMsg: gov.ExecuteMsg = {
      contract: contractAddress.community,
      msg: Buffer.from(JSON.stringify(communitySpend)).toString('base64'),
    };

    return executeMsg;
  }, [amount, contractAddress.community, recipient]);

  return (
    <PollCreateBase
      title="Community Pool Spend"
      description="Submit a proposal to send / receive community pool fund"
      onCreateMsg={createMsg}
      submitButtonStatus={
        recipient.length > 0 &&
        amount.length > 0 &&
        !invalidAmount &&
        !invalidRecipient
          ? true
          : 'disabled'
      }
    >
      <FormLabel label="Recipient Address" className="form-label">
        <TextInput
          placeholder="terra1..."
          fullWidth
          value={recipient}
          onChange={({ target }) => setRecipient(target.value)}
          error={!!invalidRecipient}
          helperText={invalidRecipient}
        />
      </FormLabel>

      <FormLabel
        label="Amount of NEB to request"
        aside={
          communityNebBalance && (
            <FormLabelAside
              onClick={() =>
                communityNebBalance &&
                setAmount(formatUInput(communityNebBalance.balance) as NEB)
              }
            >
              <WalletIcon /> {formatUToken(communityNebBalance.balance)}
            </FormLabelAside>
          )
        }
        className="form-label"
      >
        <NumberInput<NEB>
          maxIntegerPoints={14}
          maxDecimalPoints={6}
          placeholder="0.00"
          fullWidth
          value={amount}
          onChange={setAmount}
          error={!!invalidAmount}
          helperText={invalidAmount}
          InputProps={{
            endAdornment: <InputAdornment position="end">NEB</InputAdornment>,
          }}
        />
      </FormLabel>
    </PollCreateBase>
  );
}
