import { FormLabel, TextInput } from '@nebula-js/ui';
import { useTokenSearchDialog } from 'components/dialogs/useTokenSearchDialog';
import React, { useCallback, useState } from 'react';
import { PollCreateBase } from './PollCreateBase';

// TODO need token list for adding token

export default function PollWhitelistCluster() {
  const [oracleFeederAddress, setOracleFeederAddress] = useState<string>('');

  const [search, searchDialogElement] = useTokenSearchDialog();

  const openSearch = useCallback(async () => {
    const result = await search({});
    console.log('PollWhitelistCluster.tsx..()', result);
  }, [search]);

  return (
    <PollCreateBase
      title="Whitelist Cluster"
      description="Register a new cluster on Nebula Protocol"
      onCreateMsg={() => undefined}
      submitButtonStatus
    >
      <button onClick={openSearch}>Token Search</button>

      <FormLabel label="Oracle Feeder Address" className="form-label">
        <TextInput
          placeholder="terra1..."
          fullWidth
          value={oracleFeederAddress}
          onChange={({ target }) => setOracleFeederAddress(target.value)}
        />
      </FormLabel>

      {searchDialogElement}
    </PollCreateBase>
  );
}
