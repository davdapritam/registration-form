import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL;

  constructor(private _http: HttpClient) {
this.ROOT_URL = 'http://192.168.139.90:9000'
  }

  sendProduct(data: any){

    return this._http.post<any>(`${this.ROOT_URL}/product/bulkProduct`, data);
  }

  // update product by its id
  updateProduct(data: any, id: string){

    return this._http.put(`${this.ROOT_URL}/${id}`, data);
    
  }

  // delete product by its id
  deleteProduct(data: any, id: string){
    return this._http.delete(`${this.ROOT_URL}/${id}`, data);
  }

  
}
