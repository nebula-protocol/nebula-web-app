import React from 'react';
import styled from 'styled-components';
import { ChevronRight } from '@material-ui/icons';
import { Box } from '@material-ui/core';
import { Text } from '@nebula-js/ui';

interface ActionPanelProps {
  className?: string;
}

function ActionPanelBase({ className }: ActionPanelProps) {
  return (
    <div className={className}>
      <div id="action-panel-highlight" className="top-part">
        <Box>
          <Box display="flex" flexDirection="row">
            <Text weight={500}>GET LUST</Text>
            <Text>with LUNA</Text>
          </Box>
          <Text variant="label">Buy or Mint Cluster Token with LUNA</Text>
        </Box>
        <ChevronRight />
      </div>
      <div className="bottom-part">
        <Box>
          <Box display="flex" flexDirection="row">
            <Text weight={500}>GET LUST</Text>
            <Text>with LUNA</Text>
          </Box>
          <Text variant="label">Buy or Mint Cluster Token with LUNA</Text>
        </Box>
        <ChevronRight />
      </div>
      <div className="top-part mt">
        <Box>
          <Box display="flex" flexDirection="row">
            <Text weight={500}>Aribitrage</Text>
            <Text> through Astroport</Text>
          </Box>
          <Text variant="label">
            Gain profit from market and intrinsic price gap
          </Text>
        </Box>
        <ChevronRight />
      </div>
      <div className="bottom-part">
        <Box>
          <Box display="flex" flexDirection="row">
            <Text weight={500}>Rebalance</Text>
            <Text>Cluster</Text>
          </Box>
          <Text variant="label">
            Gain incentive from mint or burn underlying assets
          </Text>
        </Box>
        <ChevronRight />
      </div>
    </div>
  );
}

export const ActionPanel = styled(ActionPanelBase)`
  > div {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: var(--color-gray4);
  }

  .mt {
    margin-top: 24px;
  }

  div#action-panel-highlight {
    background: linear-gradient(
      62.3deg,
      #2cbed9 -12.21%,
      #31bcd7 -12.21%,
      #ee607f 119.37%
    );
  }

  div.top-part {
    border-radius: 8px 8px 0 0;
    margin-bottom: 2px;
  }

  div.bottom-part {
    border-radius: 0 0 8px 8px;
  }
`;
