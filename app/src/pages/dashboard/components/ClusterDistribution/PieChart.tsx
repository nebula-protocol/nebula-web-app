import big from 'big.js';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { Component, createRef } from 'react';
import { DefaultTheme } from 'styled-components';
import { Item } from './types';

export interface PieChartProps {
  data: Item[];
  theme: DefaultTheme;
}

export class PieChart extends Component<PieChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;

  render() {
    return <canvas ref={this.canvasRef} />;
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<PieChartProps>): boolean {
    return this.props.data !== nextProps.data;
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<PieChartProps>) {
    if (this.props.data !== prevProps.data) {
      this.chart.data.labels = this.props.data.map(({ symbol }) => symbol);
      this.chart.data.datasets[0].data = this.props.data.map(({ provided }) =>
        big(provided).toNumber(),
      );
      this.chart.data.datasets[0].backgroundColor = this.props.data.map(
        ({ color }) => color,
      );
    }

    //if (this.props.theme !== prevProps.theme) {
    //  if (this.chart.options.plugins?.datalabels) {
    //    this.chart.options.plugins.datalabels.color =
    //      this.props.theme.colors.gray3;
    //  }
    //}

    this.chart.update();
  }

  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'doughnut',
      plugins: [ChartDataLabels],
      options: {
        //@ts-ignore chart.js plugins type infer error
        radius: 100,
        cutout: 112,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          datalabels: {
            font: {
              size: 11,
            },
            display: false,
            color: 'var(--color-gray3)',
            formatter: (value, context) => {
              return context.chart.data.labels?.[context.dataIndex];
            },
          },
        },
      },
      data: {
        labels: this.props.data.map(({ symbol }) => symbol),
        datasets: [
          {
            data: this.props.data.map(({ provided }) =>
              big(provided).toNumber(),
            ),
            backgroundColor: this.props.data.map(({ color }) => color),
            borderWidth: 0,
            hoverOffset: 0,
          },
        ],
      },
    });
  };
}
