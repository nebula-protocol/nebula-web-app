import React from 'react';
import { PollCreateBase } from './PollCreateBase';

export default function PollClusterParameterChange() {
  return (
    <PollCreateBase
      title="Cluster Parameter Change"
      description="Modify parameters of an existing cluster"
      onCreateMsg={() => null}
      submitButtonStatus
    >
      <div>...</div>
    </PollCreateBase>
  );
}
