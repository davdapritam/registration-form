import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IProdut {
  approved: boolean;
  availableStock: string;
  colours: string[];
  description: string;
  hsnCode: string;
  hsnRate: number;
  id: string;
  productCategory: {
    name: string;
    _id: string; 
  };
  productDocs: {
    docName: string;
    imageURL: string;
    product: string;
    user: string;
    _id: string;
  }[];
  productName: {
    category: string;
    name: string;
    _id: string;
  };
  productPrice: {
    cod: number;
    codComission: number;
    codFinal: number;
    codGSTOnComission: number;
    codGSTOnProduct: number;
    codTCS: number;
    codTDS: number;
    product: string;
    sevenDays: number;
    sevenDaysComission: number;
    sevenDaysFinal: number;
    sevenDaysGSTOnComission: number;
    sevenDaysGSTOnProduct: number;
    sevenDaysTCS: number;
    sevenDaysTDS: number;
    thirtyDays: number;
    thirtyDaysComission: number;
    thirtyDaysFinal: number;
    thirtyDaysGSTOnComission: number;
    thirtyDaysGSTOnProduct: number;
    thirtyDaysTCS: number;
    thirtyDaysTDS: number;
    _id: string;
  }[];
  productQuality: string;
  productType: [];
  status: string;
  user: string;
  _id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  createProduct(data: any){
    return this.http.post(`${environment.ngRok}`, data);
  }
  
  getProduct(params: HttpParams) {
    return this.http.get(`${environment.ngRok}/product`, {params}) as Observable<{
      status: boolean;
      data: IProdut[];
      message?: string;
      pages: number;
      total: number;
    }>;
  }

  getSingleProduct(id: string) {
    return this.http.get(`${environment.ngRok}/product/${id}`) as Observable<{
      status: boolean;
      data: IProdut
    }>;
  }

  updateProductPrice(id: string, d: {[key: string]: number | string}) {
    return this.http.put(`${environment.ngRok}/productPrice/${id}`, d);
  }

  approveProduct(id: string, d: {approved: boolean}) {
    return this.http.put(`${environment.ngRok}/product/approveProduct/${id}`, d) as Observable<{
      status: boolean,
      message?: string
    }>;
  }
}
