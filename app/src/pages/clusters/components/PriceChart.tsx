import { formatToken } from '@nebula-js/notation';
import { JSDateTime, UST, uUST } from '@nebula-js/types';
import { DiffSpan } from '@nebula-js/ui';
import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
} from 'chart.js';
import c from 'color';
import { format } from 'date-fns';
import React, { Component, createRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Filler,
  Legend,
  Title,
  Tooltip,
);

interface ChartData {
  y: number;
  amount: uUST;
  date: JSDateTime;
}

export interface PriceChartProps {
  data: ChartData[];
  theme: DefaultTheme;
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
            1,200<sub>.99 USD</sub>
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
      this.props.data !== nextProps.data || this.props.theme !== nextProps.theme
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

    if (prevProps.theme !== this.props.theme) {
      this.chart.data.datasets[0].backgroundColor = c(
        this.props.theme.colors.paleblue.main,
      )
        .alpha(0.05)
        .toString();
      this.chart.data.datasets[0].borderColor =
        this.props.theme.colors.paleblue.main;
    }

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

            backgroundColor: c(this.props.theme.colors.paleblue.main)
              .alpha(0.05)
              .toString(),
            borderColor: this.props.theme.colors.paleblue.main,
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
    background-color: ${({ theme }) => theme.colors.gray14};

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
      color: ${({ theme }) => theme.colors.white44};
    }

    > p {
      color: ${({ theme }) => theme.colors.white92};

      font-size: 32px;
      font-weight: 500;

      sub {
        font-size: 12px;
        vertical-align: unset;
      }
    }

    > span {
      font-size: 12px;

      svg {
        transform: translateY(2px);
      }
    }
  }
`;
