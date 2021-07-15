import { formatRate, formatUTokenDecimal2 } from '@nebula-js/notation';
import { DiffSpan, IconAndLabels, sectionStyle } from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React, { DetailedHTMLProps } from 'react';
import styled from 'styled-components';
import { ClustersListItem } from '../../models/clusters';

export interface ClustersCardsProps
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  listItems: ClustersListItem[];
  onClusterClick: (id: string) => void;
}

function ClustersCardsBase({
  listItems,
  onClusterClick,
  ...sectionProps
}: ClustersCardsProps) {
  return (
    <ul {...sectionProps}>
      {listItems.map(
        ({
          index,
          id,
          name,
          price,
          hr24,
          hr24diff,
          marketCap,
          volume,
          premium,
          totalProvided,
        }) => (
          <li key={'row' + index} onClick={() => onClusterClick(id)}>
            <IconAndLabels
              text={name}
              subtext={
                <>
                  {formatUTokenDecimal2(price)} UST{' '}
                  <DiffSpan
                    diff={hr24diff}
                    translateIconY={1}
                    style={{ fontSize: '0.85714286em' }}
                  >
                    {formatRate(hr24diff)}%
                  </DiffSpan>
                </>
              }
              iconSize="4.28571429em"
              textSize="1.42857143em"
              subtextSize="1em"
              textGap="0.2em"
            />

            <div className="values">
              <div>
                <h5>MARKET CAP</h5>
                <p>{formatUTokenDecimal2(marketCap)} UST</p>
              </div>

              <div>
                <h5>TOTAL PROVIDED</h5>
                <p>{formatUTokenDecimal2(totalProvided)} UST</p>
              </div>

              <div>
                <h5>PREMIUM</h5>
                <p>{formatRate(premium)}%</p>
              </div>

              <div>
                <h5>VOLUME</h5>
                <p>{formatUTokenDecimal2(volume)} UST</p>
              </div>
            </div>
          </li>
        ),
      )}
    </ul>
  );
}

export const StyledClustersCards = styled(ClustersCardsBase)`
  list-style: none;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.42857143em;

  li {
    cursor: pointer;

    height: 358px;

    ${sectionStyle};

    background-color: var(--color-gray14);

    &:hover {
      background-color: var(--color-gray22);
    }
  }

  .values {
    margin-top: 3.42857143em;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.71428571em;

    h5 {
      font-size: 12px;
      color: var(--color-white44);

      margin-bottom: 0.28571429em;
    }

    p {
      font-size: 14px;
      color: var(--color-white92);
    }
  }
`;

export const ClustersCards = fixHMR(StyledClustersCards);
