import React from 'react';
import { PollCreateBase } from './PollCreateBase';

export default function PollGovernanceParameterChange() {
  return (
    <PollCreateBase
      title="Governance Parameter Change"
      description="Modify parameters of an existing cluster"
      onCreateMsg={() => null}
      submitButtonStatus
    >
      <div>...</div>
    </PollCreateBase>
  );
}
