import { terraswap, Token } from '@libs/types';
import { Delete } from '@material-ui/icons';
import { useTokenSearchDialog } from 'components/dialogs/useTokenSearchDialog';
import { TokenLabel } from 'pages/poll/components/TokenLabel';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { SearchIcon } from '../../../@nebula-js/icons';

export interface FormAsset {
  info: terraswap.AssetInfo;
  amount: Token;
}

interface ClusterAssetsFormProps {
  assets: FormAsset[];
  onAssetsChange: (
    nextAssets: FormAsset[] | ((prevAssets: FormAsset[]) => FormAsset[]),
  ) => void;
}

export function ClusterAssetsForm({
  assets,
  onAssetsChange,
}: ClusterAssetsFormProps) {
  const [search, searchDialogElement] = useTokenSearchDialog();

  const openSearch = useCallback(async () => {
    const existsAssets = assets.map(({ info }) => info);
    const selectedAsset = await search({ existsAssets });

    if (selectedAsset) {
      onAssetsChange((prev) => {
        return [
          ...prev,
          {
            info: selectedAsset,
            amount: '' as Token,
          } as FormAsset,
        ];
      });
    }
  }, [assets, onAssetsChange, search]);

  const onTargetChange = useCallback(
    (asset: terraswap.AssetInfo, nextAmount: Token) => {
      onAssetsChange((prev) => {
        const assetIndex = prev.findIndex(
          (targetAsset) => targetAsset.info === asset,
        );
        const next = [...prev];
        next[assetIndex] = {
          info: asset,
          amount: nextAmount,
        } as FormAsset;
        return next;
      });
    },
    [onAssetsChange],
  );

  const onRemoveAsset = useCallback(
    (asset: terraswap.AssetInfo) => {
      onAssetsChange((prev) => {
        return prev.filter((targetAsset) => targetAsset.info !== asset);
      });
    },
    [onAssetsChange],
  );

  return (
    <section>
      <SearchBox onClick={openSearch} />
      {assets.length < 1 ? (
        <EmptyTokens onClick={openSearch} />
      ) : (
        <>
          <Subtitle>Enter allocation amount</Subtitle>
          {assets.map(({ info, amount }, i) => (
            <AllocationBox key={`asset-${i}`}>
              <div>
                <StyledTokenLabel assetInfo={info} />
                <AllocationInput
                  placeholder="0"
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    onTargetChange(info, e.target.value as Token)
                  }
                />
              </div>
              <div>
                <StyledDelete onClick={() => onRemoveAsset(info)} />
              </div>
            </AllocationBox>
          ))}
        </>
      )}
      {searchDialogElement}
    </section>
  );
}

interface SearchProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const SearchBox = ({ onClick }: SearchProps) => {
  return (
    <SearchBoxContainer onClick={onClick}>
      <StyledSearchIcon />
      Search tokens to add
    </SearchBoxContainer>
  );
};

const EmptyTokens = ({ onClick }: SearchProps) => (
  <EmptyTokensContainer onClick={onClick}>Empty</EmptyTokensContainer>
);

const StyledTokenLabel = styled(TokenLabel)`
  height: auto;
  display: inline-flex;
`;

const StyledDelete = styled(Delete)`
  font-size: 20px;
  cursor: pointer;
  color: var(--color-white2);
  transform: translateY(1px);
`;

const AllocationBox = styled.div`
  border-radius: 8px;
  border: solid 1px var(--color-gray7);
  display: flex;
  align-items: center;
  margin-top: 14px;
  > div:first-child {
    flex: 1;
    padding: 20px 22px;
    display: flex;
    border-right: 1px solid var(--color-gray7);
    gap: 20px;
  }
  > div:last-child {
    padding: 20px 22px;
  }
`;

const AllocationInput = styled.input`
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  font-size: 100%;
  font: inherit;
  width: 100%;
  background-color: inherit;
  color: var(--color-white2);
  font-size: var(--font-size14-12);
  text-align: right;
`;

const Subtitle = styled.p`
  margin-top: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-white6);
`;

const EmptyTokensContainer = styled.div`
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  height: 108px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: dashed 1px var(--color-gray7);
  color: var(--color-white6);
`;

const StyledSearchIcon = styled(SearchIcon)`
  color: var(--color-blue);
  font-size: 16px;
  margin-right: 12px;
`;

const SearchBoxContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  border: solid 1px var(--color-gray7);
  background-color: var(--color-gray3);
  color: var(--color-white6);
`;
