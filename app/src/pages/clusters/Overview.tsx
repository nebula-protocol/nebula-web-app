import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { Text, breakpoints, Section } from '@nebula-js/ui';
import { useMediaQuery } from 'react-responsive';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { PriceChart } from './components/Chart';
import { ActionPanel } from './components/ActionPanel';
import { ClusterView } from './models/types';
import { AllocationTable } from './components/AllocationTable';

interface OverviewProps {
  clusterView: ClusterView;
}

export function Overview({ clusterView }: OverviewProps) {
  const isMobile = useMediaQuery({ maxWidth: breakpoints.tablet.max });

  return isMobile ? (
    <Box mt={2}>
      <CenteredLayout>
        <PriceChart />
        <Section>ajsdjasd</Section>
      </CenteredLayout>
    </Box>
  ) : (
    <Box my={10}>
      <CenteredLayout>
        <Text variant="h6" weight={500}>
          Cluster price changes over time
        </Text>
        <Text variant="body2">Last Updated: Mar 24th, 2022. (4:21 PM CET)</Text>
        <Grid container spacing={3}>
          <Grid item md={8} sm={12} zeroMinWidth>
            <PriceChart />
            <Box mt={4}>
              <Text variant="h6" weight={500}>
                Cluster Description
              </Text>
            </Box>
            <Box mt={1}>
              <Text>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui
                deleniti ad saepe soluta mollitia tempora voluptate illum, porro
                voluptatibus at nihil quisquam corporis minus illo
                exercitationem reprehenderit libero veritatis vel?
              </Text>
            </Box>
          </Grid>
          <Grid item md={4}>
            <ActionPanel />
          </Grid>
        </Grid>
        <Box mt={8}>
          <Text variant="h6" weight={500}>
            Current Value Allocation
          </Text>
          <Text variant="body2">LUNAUST is currently made up of ...</Text>
          <AllocationTable clusterView={clusterView} />
        </Box>
      </CenteredLayout>
    </Box>
  );
}
