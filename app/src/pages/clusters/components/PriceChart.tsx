import { JSDateTime, uUST } from '@nebula-js/types';
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
import { format, toDate } from 'date-fns';
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
          //tooltip: {
          //
          //},
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
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

            backgroundColor: '#eeeeee',
            borderColor: '#cccccc',
          },
        ],
      },
    });
  };
}

function checkTickPrint(i: number, length: number, timestamp: number): boolean {
  const date = toDate(timestamp).getDate();

  // always print
  // if the tick is first of ticks
  if (i === 0) {
    return true;
  }
  // print 1 or 15
  // if the tick is not near first or last
  else if (date === 1 || date === 15) {
    return i > 3 && i < length - 4;
  }

  return false;
}

export function xTimestampAixs(datetimes: JSDateTime[]): string[] {
  return datetimes.map((timestamp, i) => {
    return i === datetimes.length - 1
      ? 'Now'
      : checkTickPrint(i, datetimes.length, timestamp)
      ? format(timestamp, 'MMM d')
      : '';
  });
}

const Container = styled.div`
  width: 100%;
  height: 345px;
  position: relative;

  background-color: ${({ theme }) => theme.colors.gray14};

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;
