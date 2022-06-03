import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  // Get Seller Payment Info
  getSellerPaymentInfo(paymentId?: string | null, reqParams?: any | null): Observable<any | null> {
    let params = new HttpParams();
    if (reqParams) {
      for (const key in reqParams) {
        params = params.append(key, reqParams[key]);
      }
    }
    return paymentId ? this.http.get(`${environment.serverUrl}/payment/${paymentId}`) : this.http.get(`${environment.serverUrl}/payment`, { params: params });
  }
}
