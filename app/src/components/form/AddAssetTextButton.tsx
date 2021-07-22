import { EmptyButton, EmptyButtonProps } from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface AddAssetTextButtonProps
  extends Omit<EmptyButtonProps, 'ref'> {}

function AddAssetTextButtonBase(props: AddAssetTextButtonProps) {
  return <EmptyButton {...props} />;
}

export const StyledAddAssetTextButton = styled(AddAssetTextButtonBase)`
  font-size: 1em;
  font-weight: 500;

  padding-left: 0.2em;

  svg {
    transform: scale(1.3);
    margin-right: 0.4em;
  }
`;

export const AddAssetTextButton = fixHMR(StyledAddAssetTextButton);
