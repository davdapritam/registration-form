import { Component, ElementRef, OnInit } from '@angular/core';
import { ChartType } from 'chart.js'
import { PaymentsService } from '../../services/payments/payments.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  payments: Array<any> = [];

  chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  chartType: ChartType = 'bar';
  chartData = [
    {data: [8510, 20145, 62447, 24750, 0, 65120, 34785, 41285, 34715, 5500, 0, 41258 ], label: 'Payment Info'}
  ];
  chartOption = {
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
  
  constructor(private toast: ToastrService, private element: ElementRef, private payment: PaymentsService) { }

  ngOnInit(): void {
    this.payment.getSellerPaymentInfo(null, {status: 'complete'}).subscribe(payments => {
      this.payments = payments.data;
    }, err => {
      this.toast.error(err.message, 'Error Occured');
    });
  }

  ngAfterViewInit(): void {
    this.element.nativeElement.querySelector('#complete').classList.add('active');
  }

  filterPayment(status: string): void {
    this.element.nativeElement.querySelector('#complete').classList.remove('active');
    this.element.nativeElement.querySelector('#pending').classList.remove('active');
    this.element.nativeElement.querySelector('#penalty').classList.remove('active');
    this.element.nativeElement.querySelector(`#${status}`).classList.add('active');
    this.payment.getSellerPaymentInfo(null, {status}).subscribe(async payments => {
      this.payments = await payments.data ? payments.data : [];
    }, err => {
      this.toast.error(err.message, 'Error Occured');
    });
  }

  getFirmName(payment: any): string {
    return payment && payment.buyer && payment.buyer.firm && payment.buyer.firm.firmName ? payment.buyer.firm.firmName : ' N/A';
  }

}
