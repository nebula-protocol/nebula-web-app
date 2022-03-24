import { truncate } from '@libs/formatter';
import { NetworkInfo } from '@terra-money/use-wallet';
import React from 'react';

export interface FinderAddressLinkProps {
  network: NetworkInfo;
  address: string;
  shortenAddress?: boolean;
}

export function FinderAddressLink({
  network,
  address,
  shortenAddress,
}: FinderAddressLinkProps) {
  return (
    <a
      href={`https://finder.extraterrestrial.money/${network.name}/address/${address}`}
      target="_blank"
      rel="noreferrer"
      // TODO: make FinderAddressLink of Nebula
      style={{ color: 'var(--color-blue01)', textDecoration: 'none' }}
    >
      {shortenAddress ? truncate(address) : address}
    </a>
  );
}
