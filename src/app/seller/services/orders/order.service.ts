import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  // Get All/Sepcific Seller Orders
  getSellerOrders(orderId?: string | null, reqParams?: any | null): Observable<any | null> {
    let params = new HttpParams();
    if (reqParams) {
      for (const key in reqParams) {
        params = params.append(key, reqParams[key]);
      }
    }
    return orderId ? this.http.get(`${environment.serverUrl}/order/${orderId}`) : this.http.get(`${environment.serverUrl}/order`, { params: params });
  }
}
