import { formatToken } from '@libs/formatter';
import { Luna } from '@libs/types';
import { AnimateNumber } from '@libs/ui';
import React, { useCallback, useState } from 'react';

export default {
  title: 'components/AnimateNumber',
};

export const Basic = () => {
  const [n, setN] = useState<Luna>('1000' as Luna);

  const updateNumber = useCallback(() => {
    setN(
      Math.floor(
        Math.random() * (Math.random() > 0.5 ? 100000000 : 100000),
      ).toString() as Luna,
    );
  }, []);

  return (
    <div>
      <AnimateNumber format={formatToken}>{n}</AnimateNumber>
      <div>
        <button onClick={updateNumber}>Update Number</button>
      </div>
    </div>
  );
};
