import { PollCreateBase } from './PollCreateBase';
import React from 'react';

export default function PollWhitelistCluster() {
  return (
    <PollCreateBase
      title="Whitelist Cluster"
      description="Register a new cluster on Nebula Protocol"
      onCreateMsg={() => null}
      submitButtonStatus
    >
      Form...
    </PollCreateBase>
  );
}
