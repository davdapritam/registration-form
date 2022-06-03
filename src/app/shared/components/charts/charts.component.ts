import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @Input() inputChartLabels: Array<string> = [];
  @Input() inputChartType: ChartType = 'pie';
  @Input() inputChartData: Array<{data: Array<number>, label: string}> = [];
  @Input() colorRequired: number = 0;
  @Input() inputChartOption: any = {};

  public chartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.inputChartData[0]?.data,
        label: this.inputChartData[0]?.label,
        backgroundColor: this.generateColourArray(this.colorRequired),
        borderColor: 'white',
        pointBackgroundColor: this.random_rgba(),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: this.random_rgba(),
        pointHoverBorderColor: this.random_rgba(),
        fill: 'origin',
      }
    ],
    labels: this.inputChartLabels
  };

  chartPlugins = [ DatalabelsPlugin ]

  public chartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },

    scales: {
      yAxes: {
        title: {
          display: true,
          text: 'Payments'
        }
      },
      xAxes: {
        title: {
          display: true,
          text: 'Months'
        }
      }
    },

    plugins: {
      legend: {
        display: true
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };

  public chartType: ChartType = 'pie';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor() { }

  ngOnInit(): void {
    this.chartData.datasets[0]['data'] = this.inputChartData[0]?.data;
    this.chartData.datasets[0]['label'] = this.inputChartData[0]?.label;
    this.chartData.datasets[0]['backgroundColor'] = this.generateColourArray(this.colorRequired)
    this.chartData.labels = this.inputChartLabels;
    this.chartType = this.inputChartType;
    this.chartOptions = this.inputChartOption;
  }

  random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    let alpha = Math.floor(Math.random() * ( 9 - 2 + 1 ));
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + (alpha === 0 ? 0.4 : alpha / 10) + ')';
  }

  generateColourArray(num: number) {
    let colorArray = [];
    for (let index = 0; index < num; index++) {
      colorArray.push(this.random_rgba());
    }
    return colorArray;
  }

}
