import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { OrderService } from '../../services/orders/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterViewInit {
  orders: Array<any> = [];

  constructor(private toast: ToastrService, private element: ElementRef, private order: OrderService) { }

  ngOnInit(): void {
    this.order.getSellerOrders(null, {status: 'active', approved: true}).subscribe(orders => {
      this.orders = orders.data;
    }, err => {
      this.toast.error(err.message, 'Error Occured');
    });
  }

  ngAfterViewInit(): void {
    this.element.nativeElement.querySelector('#active').classList.add('active');
  }

  filterOrder(status: string): void {
    this.element.nativeElement.querySelector('#active').classList.remove('active');
    this.element.nativeElement.querySelector('#pending').classList.remove('active');
    this.element.nativeElement.querySelector('#cancel').classList.remove('active');
    this.element.nativeElement.querySelector('#ready_to_ship').classList.remove('active');
    this.element.nativeElement.querySelector('#complete').classList.remove('active');
    this.element.nativeElement.querySelector(`#${status}`).classList.add('active');
    this.order.getSellerOrders(null, {status, approved: status === 'pending' ? false : true}).subscribe(async orders => {
      this.orders = await orders.data ? orders.data : [];
    }, err => {
      this.toast.error(err.message, 'Error Occured');
    });
  }

  getFirmName(order: any): string {
    return order && order.orderBy && order.orderBy.firm && order.orderBy.firm.firmName ? order.orderBy.firm.firmName : order.orderBy.firstName + ' ' + order.orderBy.lastName;
  }

  getCreditPeriod(period: string): string {
    let periodValue = '';
    switch (period) {
      case 'cod': periodValue = 'COD';
      break;
      case 'seven_days': periodValue = '7 Days';
      break;
      case 'thirty_days': periodValue = '30 Days';
      break;
      case 'fortyfive_days': periodValue = '45 Days';
      break;
      default: periodValue = 'N/A';
      break;
    }
    return periodValue;
  }

}
