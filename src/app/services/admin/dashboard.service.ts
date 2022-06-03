import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IToalCount {
  totalActiveBuyer: number;
  totalActiveSeller: number;
  totalRegisteredUser: number;
  totalSalesInPrice: number;
  totalSalesInQty: number;
  totalSalesReturnAmount: number;
  totalSalesReturnQty: number;
  totalTodayOrderDelivery: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  getTotalDashboard(params: HttpParams) {

    return this.http.get(`${environment.ngRok}/reports/dashboard`, {params}) as Observable<{
      data: IToalCount;
      pages: number;
      status: boolean;
    }>;
  }
}
