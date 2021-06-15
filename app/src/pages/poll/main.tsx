import { Section } from '@nebula-js/ui';
import { FormLayout } from 'components/layouts/FormLayout';
import styled from 'styled-components';
import React from 'react';

export interface PollMainProps {
  className?: string;
}

function PollMainBase({ className }: PollMainProps) {
  return (
    <FormLayout className={className} title="Create Poll">
      <Section>
        <h2>Choose a poll</h2>
        <ul>
          <li>
            <h3>Asset Listing</h3>
            <ul>
              <li>Register Whitelist Asset</li>
              <li>Pre-IPO</li>
              <li>Delist Asset</li>
            </ul>
          </li>
          <li>
            <h3>Reward Distribution Ratio</h3>
            <ul>
              <li>mAsset Reward Distribution</li>
              <li>sLP Reward</li>
              <li>Governance Voter Reward</li>
            </ul>
          </li>
        </ul>
      </Section>
    </FormLayout>
  );
}

export default styled(PollMainBase)`
  // TODO
`;
