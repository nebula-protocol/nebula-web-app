import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import styled from 'styled-components';
import { breakpoints } from '@nebula-js/ui';
import { priceData } from './priceData';

interface PriceChartProps {
  className?: string;
}

function PriceChartBase({ className }: PriceChartProps) {
  const chartContainerRef = useRef<any>();
  const chart = useRef<any>();
  const resizeObserver = useRef<any>();
  const [chartMode, setChartMode] = useState<'market' | 'intrinsic'>('market');

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: '#253248',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          color: '#334158',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      //   priceScale: {
      //     borderColor: '#485c7b',
      //   },
      timeScale: {
        borderColor: '#485c7b',
      },
    });

    // console.log(chart.current);

    const candleSeries = chart.current.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });

    candleSeries.setData(priceData);
  }, []);

  // Resize chart on container resizes.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  return (
    <div className={className}>
      <div className="selection-container">
        <div
          data-selected={chartMode === 'market'}
          onClick={() => setChartMode('market')}
        >
          Market
        </div>
        <div
          data-selected={chartMode === 'intrinsic'}
          onClick={() => setChartMode('intrinsic')}
        >
          Intrinsic
        </div>
      </div>
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
}

export const PriceChart = styled(PriceChartBase)`
  .chart-container {
    flex: 1;
    height: 430px;
    width: 100%;

    @media (max-width: ${breakpoints.tablet.max}px) {
      height: 300px;
    }
  }

  .selection-container {
    display: flex;
    grid-gap: 16px;
    margin: 24px 0;
    width: fit-content;

    @media (max-width: ${breakpoints.tablet.max}px) {
      background: var(--color-gray3);
      border-radius: 20px;
      margin: 16px 0;
    }

    > div {
      font-size: 16px;
      padding: 8px 16px;
      width: fit-content;
      border-radius: 20px;
      color: var(--color-white5);
      cursor: pointer;

      &[data-selected='true'] {
        background: var(--color-blue);
        color: var(--color-white1);
      }

      @media (max-width: ${breakpoints.tablet.max}px) {
        padding: 4px 32px;
        font-size: 14px;
      }
    }
  }
`;
