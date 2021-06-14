import {
  DiffSpan,
  HorizontalScrollTable,
  IconAndLabels,
  StorybookBackgroundColor,
} from '@nebula-js/ui';
import { Meta } from '@storybook/react';
import React from 'react';
import { useTheme } from 'styled-components';

export default {
  title: 'ui/HorizontalScrollTable',
} as Meta;

const data = Array.from(
  { length: Math.floor(Math.random() * 15) + 10 },
  (_, i) => {
    return {
      index: i,
      id: `cluster-${i}`.toUpperCase(),
      name: `New is always better ${i}`,
      nameLowerCase: `New is always better ${i}`.toLowerCase(),
      description: `NIAL ${i}`,
      price: '102.01',
      hr24diff: (i % 3) - 1,
      hr24: '60.78',
      marketCap: '254,100.062',
      volume: '254,100.62',
    };
  },
);

export const Basic = () => {
  const theme = useTheme();

  return (
    <>
      <StorybookBackgroundColor />
      <HorizontalScrollTable
        minWidth={1000}
        containerStyle={{
          backgroundColor: theme.colors.gray14,
          maxWidth: '80vw',
          margin: '50px auto',
          borderRadius: 8,
        }}
      >
        <thead>
          <tr>
            <th>
              <span>Cluster</span>
            </th>
            <th>
              <span>Price</span>
            </th>
            <th>
              <span>24HR</span>
            </th>
            <th>
              <span>Market Cap</span>
            </th>
            <th>
              <span>Volume</span>
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
              marketCap,
              volume,
            }) => (
              <tr key={'row' + index}>
                <td>
                  <IconAndLabels text={name} subtext={description} />
                </td>
                <td>{price} UST</td>
                <td>
                  <DiffSpan diff={hr24diff}>{hr24}%</DiffSpan>
                </td>
                <td>{marketCap} UST</td>
                <td>{volume} UST</td>
              </tr>
            ),
          )}
        </tbody>
      </HorizontalScrollTable>
    </>
  );
};

export const Header_Contents = () => {
  const theme = useTheme();

  return (
    <>
      <StorybookBackgroundColor />
      <HorizontalScrollTable
        minWidth={1000}
        headerContents={
          <div style={{ padding: 20 }}>
            <h2>Title</h2>
          </div>
        }
        containerStyle={{
          backgroundColor: theme.colors.gray14,
          maxWidth: '80vw',
          margin: '50px auto',
          borderRadius: 8,
        }}
      >
        <thead>
          <tr>
            <th>
              <span>Cluster</span>
            </th>
            <th>
              <span>Price</span>
            </th>
            <th>
              <span>24HR</span>
            </th>
            <th>
              <span>Market Cap</span>
            </th>
            <th>
              <span>Volume</span>
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
              marketCap,
              volume,
            }) => (
              <tr key={'row' + index}>
                <td>
                  <IconAndLabels text={name} subtext={description} />
                </td>
                <td>{price} UST</td>
                <td>
                  <DiffSpan diff={hr24diff}>{hr24}%</DiffSpan>
                </td>
                <td>{marketCap} UST</td>
                <td>{volume} UST</td>
              </tr>
            ),
          )}
        </tbody>
      </HorizontalScrollTable>
    </>
  );
};
