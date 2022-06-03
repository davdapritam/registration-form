import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  overviewLabels = ['Received', 'Out Standing', 'Penalties', 'Debts'];
  overviewType: ChartType = 'pie';
  overviewData = [
    {data: [528960, 245870, 25000, 32000], label: 'Payment overview'}
  ];
  overviewChartOption = {
    elements: {
      line: {
        tension: 0.5
      }
    },   
    scales: {
      yAxes: {},
      xAxes: {}
    },
    plugins: {
      legend: {
        display: true
      },
      datalabels: {
        anchor: 'center',
        align: 'center'
      }
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}
