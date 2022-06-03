import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient
  ) { }

  getTopTenBuyer(params: HttpParams) {
    return this.http.get(`${environment.ngRok}/reports/top_10_buyers`, {params});
  }

  getSellReport(params: HttpParams) {
    return this.http.get(`${environment.ngRok}/reports/product_sell_report`, {params});
  }
}
