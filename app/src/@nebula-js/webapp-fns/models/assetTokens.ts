import { CW20Addr } from '@nebula-js/types';

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

  getSymbol = (address: CW20Addr) => {
    return this._address.get(address);
  };
}
