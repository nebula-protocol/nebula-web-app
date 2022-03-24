import {
  BytesValid,
  useValidateStringBytes,
} from '@libs/use-string-bytes-length';
import { FormLabel, TextInput } from '@nebula-js/ui';
import React, { useMemo, useState } from 'react';
import { PollCreateBase } from './PollCreateBase';

export default function PollWhitelistClusterText() {
  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [clusterSymbol, setClusterSymbol] = useState<string>('');
  const [clusterName, setClusterName] = useState<string>('');
  const [clusterDescription, setClusterDescription] = useState<string>('');

  // ---------------------------------------------
  // logics
  // ---------------------------------------------

  const invalidSymbolLength = useValidateStringBytes(clusterSymbol, 2, 13);

  const invalidSymbolRegex = !clusterSymbol.match(/^[a-zA-Z]*$/);

  const invalidClusterName = useValidateStringBytes(clusterName, 3, 64);

  const invalidClusterDescription = useValidateStringBytes(
    clusterDescription,
    4,
    1024,
  );

  const extraDescription = useMemo(() => {
    return `\nCluster Name: ${clusterName}\nCluster Symbol: ${clusterSymbol}\nCluster Description: ${clusterDescription}`;
  }, [clusterName, clusterSymbol, clusterDescription]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      title="Whitelist Cluster"
      description="Register a new cluster on Nebula Protocol"
      extraDescription={extraDescription}
      onCreateMsg={() => undefined}
      submitButtonStatus={
        clusterSymbol.length > 0 &&
        clusterName.length > 0 &&
        clusterDescription.length > 0 &&
        !invalidSymbolLength &&
        !invalidSymbolRegex &&
        !invalidClusterName &&
        !invalidClusterDescription
          ? true
          : 'disabled'
      }
    >
      <FormLabel label="Cluster Name" className="form-label">
        <TextInput
          fullWidth
          value={clusterName}
          onChange={({ target }) => setClusterName(target.value)}
          error={!!invalidClusterName}
          helperText={
            invalidClusterName === BytesValid.LESS
              ? 'Cluster name must be at least 4 bytes.'
              : invalidClusterName === BytesValid.MUCH
              ? 'Cluster name cannot be longer than 64 bytes.'
              : undefined
          }
        />
      </FormLabel>

      <FormLabel label="Symbol" className="form-label">
        <TextInput
          fullWidth
          value={clusterSymbol}
          onChange={({ target }) => setClusterSymbol(target.value)}
          error={!!invalidSymbolLength || invalidSymbolRegex}
          helperText={
            invalidSymbolLength === BytesValid.LESS
              ? 'Symbol must be at least 3 bytes.'
              : invalidSymbolLength === BytesValid.MUCH
              ? 'Symbol cannot be longer than 12 bytes.'
              : invalidSymbolRegex
              ? 'Symbol can only include a-z or A-Z.'
              : undefined
          }
        />
      </FormLabel>

      <FormLabel label="Cluster Description" className="form-label">
        <TextInput
          fullWidth
          multiline
          minRows={4}
          maxRows={10}
          value={clusterDescription}
          onChange={({ target }) => setClusterDescription(target.value)}
          error={!!invalidClusterDescription}
          helperText={
            invalidClusterDescription === BytesValid.LESS
              ? 'Clusterster description must be at least 4 bytes.'
              : invalidClusterDescription === BytesValid.MUCH
              ? 'Clusterster description cannot be longer than 1024 bytes.'
              : undefined
          }
        />
      </FormLabel>
    </PollCreateBase>
  );
}
