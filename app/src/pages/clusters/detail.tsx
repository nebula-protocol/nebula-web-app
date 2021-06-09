import {
  breakpoints,
  Descriptions,
  DiffSpan,
  HorizontalScrollTable,
  IconAndLabels,
  Section,
  Tab,
  TabItem,
  TabSection,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

export interface ClustersDetailProps
  extends RouteComponentProps<{ cluster: string }> {
  className?: string;
}

const tabItems: TabItem[] = [
  { id: 'buy', label: 'Buy' },
  { id: 'sell', label: 'Sell' },
  { id: 'mint', label: 'Mint' },
  { id: 'burn', label: 'Burn' },
];

const chartTabItems: TabItem[] = [
  { id: 'day', label: 'D' },
  { id: 'week', label: 'W' },
  { id: 'month', label: 'M' },
  { id: 'year', label: 'Y' },
];

const data = Array.from(
  { length: Math.floor(Math.random() * 10) + 5 },
  (_, i) => {
    return {
      index: i,
      id: `tokens-${i}`.toUpperCase(),
      name: `Mirror Protocol ${i}`,
      description: `MIR ${i}`,
      price: '102.01',
      hr24diff: (i % 3) - 1,
      hr24: '60.78',
      current: '50',
      target: '45',
      amount: '100,000.202293 MIR',
    };
  },
);

function ClustersDetailBase({ className, match }: ClustersDetailProps) {
  const descriptionDisplay = useScreenSizeValue<'horizontal' | 'vertical'>({
    mobile: 'vertical',
    tablet: 'horizontal',
    pc: 'vertical',
    monitor: 'horizontal',
  });

  const headingFontSize = useScreenSizeValue<`${number}rem`>({
    mobile: '1.9rem',
    tablet: '2rem',
    pc: '2.3rem',
    monitor: '2.3rem',
  });

  const tableMinWidth = useScreenSizeValue({
    mobile: 700,
    tablet: 1000,
    pc: 1000,
    monitor: 1000,
  });

  const [tab, setTab] = useState<TabItem>(tabItems[0]);
  const [chartTab, setChartTab] = useState<TabItem>(chartTabItems[0]);

  return (
    <MainLayout className={className}>
      <header className="header">
        <IconAndLabels
          text="New is always better"
          subtext={match.params.cluster}
          iconSize="1.5em"
          iconMarginRight="0.3em"
          subtextSize="0.4em"
          textGap="0.03em"
          style={{ fontSize: headingFontSize }}
        />
        <Descriptions
          direction={descriptionDisplay}
          descriptions={[
            { label: 'VOLUME (24H)', text: '123,456 UST' },
            { label: 'TOTAL SUPPLY', text: `123,456 ${match.params.cluster}` },
          ]}
        />
      </header>

      <section className="main">
        <div>
          <Tab
            className="tab"
            items={tabItems}
            selectedItem={tab}
            onChange={setTab}
          />
          <Section style={{ minHeight: 200 }}>...</Section>
        </div>

        <TabSection
          items={chartTabItems}
          selectedItem={chartTab}
          onChange={setChartTab}
        >
          <h1>Chart</h1>
        </TabSection>
      </section>

      <section className="provided-tokens">
        <header>
          <h2>Provided Tokens</h2>
          <Descriptions
            direction={descriptionDisplay}
            descriptions={[
              { label: 'TOTAL TOKEN PROVIDED', text: '123,456 UST' },
            ]}
          />
        </header>

        <Table minWidth={tableMinWidth} fontSize="small">
          <thead>
            <tr>
              <th>
                <span>Tokens</span>
              </th>
              <th>
                <span>Price</span>
              </th>
              <th>
                <span>
                  Portfolio Ratio
                  <br />
                  Current (Target)
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map(
              ({
                index,
                name,
                description,
                price,
                hr24,
                hr24diff,
                amount,
                current,
                target,
              }) => (
                <tr key={'row' + index}>
                  <td>
                    <IconAndLabels text={name} subtext={description} />
                  </td>
                  <td>
                    {price} UST
                    <br />
                    <DiffSpan diff={hr24diff}>{hr24}%</DiffSpan>
                  </td>
                  <td>
                    {current}% <span>({target}%)</span>
                    <br />
                    {amount}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
      </section>

      <section className="about">
        <header>
          <h2>About</h2>
        </header>
        <Section>
          <p>
            <b>The New is always better</b> index is a digital asset index
            designed to track the performance of 5 large cap US technology
            companies. The intent is to provide DeFi users with on-chain
            exposure to a basket of US large cap technology equities, as well as
            to showcase the composable nature of Mirror Protocol’s assets as
            building blocks for novel products.
          </p>
          <p>
            Mirror Protocol is a DeFi protocol powered by smart contracts on the
            Terra network that enables the creation of synthetic assets called
            mirrored assets (mAssets). mAssets mimic the price behavior of
            real-world assets and give traders anywhere in the world open access
            to price exposure without the burdens of owning or transacting real
            assets.
          </p>
          <p>
            Mirror democratizes access to the wealth creation of world markets
            that many financially disenfranchised users worldwide are precluded
            from -- unlocking the vast potential of dead capital. Mirror is
            entirely community-governed and relies on a siloed, CDP-style model
            for minting mAssets that trade on DeFi apps across Terra, Ethereum,
            Binance Chain, and soon to be more.
          </p>
        </Section>
      </section>
    </MainLayout>
  );
}

const Table = styled(HorizontalScrollTable)`
  background-color: ${({ theme }) => theme.colors.gray14};
  border-radius: 8px;

  td,
  th {
    text-align: right;

    &:first-child {
      text-align: left;
    }
  }

  td {
    svg {
      font-size: 1em;
      transform: translateY(2px);
    }
  }

  thead {
    tr {
      th {
        border-bottom: 2px solid ${({ theme }) => theme.colors.gray11};
      }
    }
  }

  tbody {
    tr {
      cursor: pointer;

      &:hover {
        background-color: ${({ theme }) => theme.colors.gray22};
      }
    }

    tr:not(:last-child) {
      td {
        border-bottom: 1px solid ${({ theme }) => theme.colors.gray11};
      }
    }
  }
`;

export default styled(ClustersDetailBase)`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    margin-bottom: 1.5em;
  }

  .main {
    width: 100%;

    display: flex;
    gap: 1.3em;

    > :first-child {
      flex: 1;

      .tab {
        margin-bottom: 1.3em;
      }
    }

    > :last-child {
      width: 422px;
      align-self: flex-start;
    }
  }

  .provided-tokens,
  .about {
    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      margin: 3.5em 0 1em 0;
    }
  }

  .about {
    p {
      line-height: 1.5em;
      font-size: 1.1em;
      font-weight: 300;

      &:not(:last-child) {
        margin-bottom: 1.2em;
      }
    }
  }

  @media (max-width: ${1000}px) {
    .main {
      flex-direction: column;

      > :last-child {
        width: 100%;
      }
    }
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    .header {
      flex-direction: column;
      gap: 1em;
      align-items: flex-start;
    }

    .provided-tokens,
    .about {
      header {
        flex-direction: column;
        gap: 0.7em;
        align-items: flex-start;
      }
    }
  }

  @media (max-width: ${breakpoints.mobile.max}px) {
    .header {
      > :last-child {
        width: 100%;
      }
    }

    .provided-tokens {
      header {
        > :last-child {
          width: 100%;
        }
      }
    }
  }
`;
