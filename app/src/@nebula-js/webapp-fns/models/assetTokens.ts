import { CW20Addr, terraswap } from '@nebula-js/types';

export class AssetTokenIndex {
  private readonly _symbol: Map<string, CW20Addr>;
  private readonly _address: Map<CW20Addr, string>;

  constructor(assets: Record<string, CW20Addr>) {
    this._symbol = new Map();
    this._address = new Map();

    Object.keys(assets).forEach((symbol) => {
      const address = assets[symbol];

      this._symbol.set(symbol, address);
      this._address.set(address, symbol);
    });
  }

  getAddress = (symbol: string) => {
    return this._symbol.get(symbol);
  };

  getSymbol = (asset: CW20Addr | terraswap.AssetInfo) => {
    if (typeof asset === 'string') {
      return this._address.get(asset);
    } else if ('native_token' in asset) {
      switch (asset.native_token.denom) {
        case 'uluna':
          return 'LUNA';
        case 'uusd':
          return 'UST';
        default:
          return asset.native_token.denom.slice(1).toUpperCase();
      }
    } else if ('token' in asset) {
      return this._address.get(asset.token.contract_addr);
    }
  };
}
