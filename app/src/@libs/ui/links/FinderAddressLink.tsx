import { truncate } from '@libs/formatter';
import React from 'react';

export interface FinderAddressLinkProps {
  chainID: string;
  address: string;
  shortenAddress?: boolean;
}

export function FinderAddressLink({
  chainID,
  address,
  shortenAddress,
}: FinderAddressLinkProps) {
  return (
    <a
      href={`https://finder.extraterrestrial.money/${chainID}/address/${address}`}
      target="_blank"
      rel="noreferrer"
      // TODO: make FinderAddressLink of Nebula
      style={{ color: 'var(--color-blue01)', textDecoration: 'none' }}
    >
      {shortenAddress ? truncate(address) : address}
    </a>
  );
}
