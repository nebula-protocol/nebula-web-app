import React from 'react';
import { PollCreateBase } from './PollCreateBase';

export default function PollText() {
  return (
    <PollCreateBase
      title="Text Poll"
      description="Submit a text poll"
      onCreateMsg={() => null}
      submitButtonStatus
    />
  );
}
