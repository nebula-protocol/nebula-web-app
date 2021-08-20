import React from 'react';
import { PollCreateBase } from './PollCreateBase';

export default function PollClusterParameterChange() {
  // TODO need token list for adding token

  //const { contractAddress } = useNebulaWebapp();
  //
  //const [pricingOracle, setPricingOracle] = useState<string>('');

  return (
    <PollCreateBase
      title="Cluster Parameter Change"
      description="Modify parameters of an existing cluster"
      onCreateMsg={() => undefined}
      submitButtonStatus
    >
      <div>...</div>
    </PollCreateBase>
  );
}
