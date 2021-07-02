import { formatToken } from '@nebula-js/notation';
import { JSDateTime, UST, uUST } from '@nebula-js/types';
import { DiffSpan, Sub } from '@nebula-js/ui';
import { Chart } from 'chart.js';
import c from 'color';
import { format } from 'date-fns';
import React, { Component, createRef } from 'react';
import { getCssVariable } from 'style-router';
import styled from 'styled-components';

interface ChartData {
  y: number;
  amount: uUST;
  date: JSDateTime;
}

export interface PriceChartProps {
  data: ChartData[];
  color: string;
}

export class PriceChart extends Component<PriceChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;

  render() {
    return (
      <Container>
        <canvas ref={this.canvasRef} />
        <div>
          <h3>CURRENT PRICE</h3>
          <p>
            1,200<Sub>.99 USD</Sub>
          </p>
          <DiffSpan diff={10}>10.00</DiffSpan>
        </div>
      </Container>
    );
  }

  componentWillUnmount() {
    this.chart?.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<PriceChartProps>): boolean {
    return (
      this.props.data !== nextProps.data || this.props.color !== nextProps.color
    );
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<PriceChartProps>) {
    if (prevProps.data !== this.props.data) {
      this.chart.data.labels = xTimestampAixs(
        this.props.data.map(({ date }) => date),
      );
      this.chart.data.datasets[0].data = this.props.data.map(({ y }) => y);
    }

    //if (prevProps.theme !== this.props.theme) {
    //  this.chart.data.datasets[0].backgroundColor = c(
    //    this.props.theme.colors.paleblue.main,
    //  )
    //    .alpha(0.05)
    //    .toString();
    //  this.chart.data.datasets[0].borderColor =
    //    this.props.theme.colors.paleblue.main;
    //}

    this.chart.update();
  }

  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'line',
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label: (tooltipItem): string | string[] => {
                return (
                  formatToken(tooltipItem.parsed.y as UST<number>) + ' UST'
                );
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            grace: '25%',
            display: false,
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
      data: {
        labels: xTimestampAixs(this.props.data.map(({ date }) => date)),
        datasets: [
          {
            data: this.props.data?.map(({ y }) => y),
            fill: 'start',

            backgroundColor: c(getCssVariable('--color-paleblue'))
              .alpha(0.05)
              .toString(),
            borderColor: getCssVariable('--color-paleblue'),
            borderWidth: 2,
          },
        ],
      },
    });
  };
}

export function xTimestampAixs(datetimes: JSDateTime[]): string[] {
  return datetimes.map((timestamp) => {
    return format(timestamp, 'MMM d, yyyy');
  });
}

const Container = styled.div`
  width: 100%;
  height: 345px;
  position: relative;

  canvas {
    background-color: var(--color-gray14);

    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  div {
    position: absolute;
    top: 40px;
    left: 32px;

    > h3 {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-white44);
    }

    > p {
      color: var(--color-white92);

      font-size: 32px;
      font-weight: 500;
    }

    > span {
      font-size: 12px;

      svg {
        transform: translateY(2px);
      }
    }
  }
`;
