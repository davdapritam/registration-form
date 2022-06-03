import { Component, ElementRef, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  currentAciveTab = 'businessReport';

  // Business Report
  businessReportChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  businessReportChartType: ChartType = 'bar';
  businessReportChartData = [
    {data: [8510, 20145, 62447, 24750, 0, 65120, 34785, 41285, 34715, 5500, 0, 41258 ], label: 'Sales Info'}
  ];
  businessReportChartOption = {
    elements: {
      line: {
        tension: 0.5
      }
    },   
    scales: {
      yAxes: {
        title: {
          display: true,
          text: 'Sales'
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

  // Sales Return
  salesReturnChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  salesReturnChartType: ChartType = 'bar';
  salesReturnChartData = [
    {data: [1, 5, 0, 11, 0, 3, 0, 6, 2, 0, 0, 8 ], label: 'Sales Return Info'}
  ];
  salesReturnChartOption = {
    elements: {
      line: {
        tension: 0.5
      }
    },   
    scales: {
      yAxes: {
        title: {
          display: true,
          text: 'Sales Return'
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

  // Total Sales
  totalSalesChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  totalSalesChartType: ChartType = 'bar';
  totalSalesChartData = [
    {data: [5012, 4189, 2036, 4759, 6510, 5499, 2014, 10365, 8741, 7952, 9541, 3247], label: 'Total Sales Info'}
  ];
  totalSalesChartOption = {
    elements: {
      line: {
        tension: 0.5
      }
    },   
    scales: {
      yAxes: {
        title: {
          display: true,
          text: 'Total Sales Return'
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

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.element.nativeElement.querySelector('#businessReport').classList.add('active');
  }

  filterReport(status: string): void {
    this.element.nativeElement.querySelector('#businessReport').classList.remove('active');
    this.element.nativeElement.querySelector('#taxInvoice').classList.remove('active');
    this.element.nativeElement.querySelector('#salesReturn').classList.remove('active');
    this.element.nativeElement.querySelector('#totalSales').classList.remove('active');
    this.element.nativeElement.querySelector(`#${status}`).classList.add('active');
    this.currentAciveTab = status;
  }

}
