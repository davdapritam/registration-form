import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  // Get Product Category
  getProductCategory(): Observable<any | null> {
    return this.http.get(`${environment.serverUrl}/productCategory`);
  }

  // Get Product Quality based on selected Category
  getProductNameByCategory(categoryId: string): Observable<any | null>{
    return this.http.get(`${environment.serverUrl}/productName/${categoryId}`);
  }

  // Get All/Specific Product(s)
  getProducts(productId?: string | null, reqParams?: any | null): Observable<any | null>{
    let params = new HttpParams();
    if (reqParams) {
      for (const key in reqParams) {
        params = params.append(key, reqParams[key]);
      }
    }
    return productId ? this.http.get(`${environment.serverUrl}/product/${productId}`) : this.http.get(`${environment.serverUrl}/product`, { params: params });
  }

  // Add single product
  addSingleProduct(data: any): Observable<any | null>{
    return this.http.post(`${environment.serverUrl}/product`, data);
  }

  // Product image delete
  removeProductImage(id: string): Observable<any | null>{
    return this.http.delete(`${environment.serverUrl}/productDoc/`+ id);
  }

  // Add single product
  updateProduct(data: any, id: string): Observable<any | null>{
    return this.http.put(`${environment.serverUrl}/product/` + id, data);
  }
}
