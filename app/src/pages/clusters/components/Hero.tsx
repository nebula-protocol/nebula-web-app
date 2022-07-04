import React, { useMemo, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { RouteComponentProps, useRouteMatch, Link } from 'react-router-dom';
import { ArrowBackIos } from '@material-ui/icons';
import {
  breakpoints,
  Text,
  TokenIcon,
  VerticalLabelAndValue,
  PriceChange,
  TabItem,
  MuiTab as MainTab,
  TextLink,
} from '@nebula-js/ui';
import { ClusterView } from 'pages/clusters/models/types';
import { ValueAllocationBar } from 'components/bar/ValueAllocationBar';
import { Rate } from '@nebula-js/types';
import { Box, Grid } from '@material-ui/core';

export interface ClusterHeroProps
  extends Pick<RouteComponentProps<{ cluster: string }>, 'match' | 'history'> {
  className?: string;
  clusterView?: ClusterView;
}

const tabItems: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'get', label: 'Get' },
  { id: 'redeem', label: 'Redeem' },
  { id: 'arbitrage', label: 'Arbitrage' },
];

function ClusterHeroBase({ className, match, history }: ClusterHeroProps) {
  const isMobile = useMediaQuery({ maxWidth: breakpoints.tablet.max });

  const pageMatch = useRouteMatch<{ page: string }>(`${match.url}/:page`);

  const tab = useMemo<TabItem | undefined>(() => {
    return tabItems.find(({ id }) => id === pageMatch?.params.page);
  }, [pageMatch?.params.page]);

  const tabChange = useCallback(
    (nextTab: TabItem) => {
      history.push({
        pathname: `${match.url}/${nextTab.id}`,
      });
    },
    [history, match.url],
  );

  return isMobile ? (
    <CenteredLayout>
      <MainTab
        items={tabItems}
        selectedItem={tab ?? tabItems[0]}
        onChange={tabChange}
      />
    </CenteredLayout>
  ) : (
    <section className={className}>
      <CenteredLayout>
        <TextLink component={Link} to="/clusters">
          <ArrowBackIos /> Back to Clusters
        </TextLink>

        <Box mt={4}>
          <Grid container spacing={2}>
            <Grid item md={4}>
              <Box display="flex">
                <Box pt={'4px'} mr={1}>
                  <TokenIcon symbol="LUST" size={48} />
                </Box>
                <Box>
                  <Text variant="h1" color="white1">
                    LUST
                  </Text>
                  <Text color="white3">LUNAUST</Text>
                </Box>
              </Box>
              <Box mt={3}>
                <Text variant="label" color="white-64">
                  Last Updated: Mar 24th, 2022. (4:21 PM CET)
                </Text>
              </Box>
            </Grid>
            <Grid item md={8}>
              <Box
                display="grid"
                gridTemplateColumns="1fr 1fr 1fr"
                gridColumnGap="48px"
                gridRowGap="36px"
              >
                <VerticalLabelAndValue
                  label="Intrinsic Price"
                  tip="What is the Instritic price."
                >
                  <Box display="flex" alignItems="center" gridGap={8}>
                    <Text variant="h4" color="white1" weight={500}>
                      $123.45678
                    </Text>
                    <PriceChange diff={'0.0134' as Rate} />
                  </Box>
                </VerticalLabelAndValue>
                <VerticalLabelAndValue label="Market Price">
                  <Box display="flex" alignItems="center" gridGap={8}>
                    <Text variant="h4" color="white1" weight={500}>
                      $123.45678
                    </Text>
                    <PriceChange diff={'-0.134' as Rate} />
                  </Box>
                </VerticalLabelAndValue>
                <VerticalLabelAndValue label="Premium">
                  <Box
                    display="flex"
                    alignItems="center"
                    gridGap={8}
                    height={40}
                  >
                    <Text color="white1">$0.05</Text>
                    <PriceChange diff={'-0.134' as Rate} isOval={false} />
                  </Box>
                </VerticalLabelAndValue>
                <VerticalLabelAndValue label="Total Supplied Value">
                  <Text color="white1">$123.45678</Text>
                </VerticalLabelAndValue>
                <VerticalLabelAndValue label="Market Cap">
                  <Text color="white1">$123.45678</Text>
                </VerticalLabelAndValue>
                <VerticalLabelAndValue label="Liquidity">
                  <Text color="white1">$123.45678</Text>
                </VerticalLabelAndValue>
              </Box>
              <Box mt={4}>
                <VerticalLabelAndValue label="Current Value Allocation">
                  <ValueAllocationBar count={1} />
                </VerticalLabelAndValue>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box mt={4} sx={{ borderBottom: 1 }}>
          <MainTab
            items={tabItems}
            selectedItem={tab ?? tabItems[0]}
            onChange={tabChange}
          />
        </Box>
      </CenteredLayout>
    </section>
  );
}

export const ClusterHero = styled(ClusterHeroBase)`
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    linear-gradient(62.3deg, #2cbed9 -12.21%, #31bcd7 -12.21%, #ee607f 119.37%);
`;
