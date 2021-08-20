import { FormLabel, TextInput } from '@nebula-js/ui';
import React, { useState } from 'react';
import { PollCreateBase } from './PollCreateBase';

// TODO need token list for adding token

export default function PollWhitelistCluster() {
  const [oracleFeederAddress, setOracleFeederAddress] = useState<string>('');

  return (
    <PollCreateBase
      title="Whitelist Cluster"
      description="Register a new cluster on Nebula Protocol"
      onCreateMsg={() => undefined}
      submitButtonStatus
    >
      <FormLabel label="Oracle Feeder Address" className="form-label">
        <TextInput
          placeholder="terra1..."
          fullWidth
          value={oracleFeederAddress}
          onChange={({ target }) => setOracleFeederAddress(target.value)}
        />
      </FormLabel>
    </PollCreateBase>
  );
}
