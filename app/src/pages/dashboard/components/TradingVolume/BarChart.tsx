import { formatToken } from '@libs/formatter';
import { getCssVariable } from '@libs/style-router';
import { JSDateTime, u, UST } from '@nebula-js/types';
import { Chart } from 'chart.js';
import { format } from 'date-fns';
import React, { Component, createRef } from 'react';
import styled from 'styled-components';

interface ChartData {
  y: number;
  amount: u<UST>;
  date: JSDateTime;
}

export interface BarChartProps {
  data: ChartData[];
  color: string;
}

export class BarChart extends Component<BarChartProps> {
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

  shouldComponentUpdate(nextProps: Readonly<BarChartProps>): boolean {
    return (
      this.props.data !== nextProps.data || this.props.color !== nextProps.color
    );
  }

  componentDidMount() {
    this.createChart();

    this.updateColor();
    this.chart.update();
  }

  componentDidUpdate(prevProps: Readonly<BarChartProps>) {
    if (prevProps.data !== this.props.data) {
      this.chart.data.labels = xTimestampAixs(
        this.props.data.map(({ date }) => date),
      );
      this.chart.data.datasets[0].data = this.props.data.map(({ y }) => y);
    }

    if (prevProps.color === this.props.color) {
      this.chart.update();
    }

    setTimeout(() => {
      this.updateColor();
      this.chart.update();
    }, 100);
  }

  private updateColor = () => {
    if (this.chart.options.scales?.y?.grid) {
      this.chart.options.scales.y.grid.color =
        this.props.color === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)';
    }
    this.chart.data.datasets[0].backgroundColor =
      getCssVariable('--color-white6');
  };

  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'bar',
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
            grid: {
              display: false,
              drawBorder: false,
            },
          },
          y: {
            grace: '25%',
            position: 'right',
            min: 0,
            grid: {
              drawBorder: false,
              color:
                this.props.color === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.05)',
            },
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
            backgroundColor: getCssVariable('--color-white6'),
          },
        ],
      },
    });
  };
}

export function xTimestampAixs(datetimes: JSDateTime[]): string[] {
  return datetimes.map((timestamp) => {
    return format(timestamp, 'MMM d');
  });
}

const Container = styled.div`
  width: 100%;
  height: 250px;
`;
