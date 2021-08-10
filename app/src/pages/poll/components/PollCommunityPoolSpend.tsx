import React from 'react';
import { PollCreateBase } from './PollCreateBase';

export default function PollCommunityPoolSpend() {
  return (
    <PollCreateBase
      title="Community Pool Spend"
      description="Submit a proposal to send / receive community pool fund"
      onCreateMsg={() => null}
      submitButtonStatus
    >
      <div>...</div>
    </PollCreateBase>
  );
}
