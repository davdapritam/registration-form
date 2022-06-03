import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IOrder {
  status: string;
  approved: boolean;
  _id: string;
  product: {
    productPrice: string[];
    colours: string[];
    productType: [];
    availableStock: string;
    productDocs: string[];
    approved: boolean;
    status: string;
    _id: string;
    productName: string;
    productCategory: string;
    productQuality: string;
    description: string;
    hsnCode: string;
    hsnRate: number;
    user: string;
    id: string;
  },
  quantity: string;
  orderBy: {
    mobile: string;
    sellerRole: string;
    PANNumber: string;
    identityProofs: string[];
    docs: string[];
    firm: {
      firmName: string;
      GSTNumber: string;
      address: string;
      user: string;
      isDeleted: boolean;
      updatedBy: string;
      deletedBy: string;
      deletedAt: string;
      _id: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    },
    bank: string;
    creditLimit: number;
    referredUser: string;
    approved: boolean;
    approvedBy: string;
    status: string;
    isDeleted: boolean;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: null;
  },
  orderTo: {
    mobile: string;
    sellerRole: string;
    PANNumber: string;
    identityProofs: string[];
    docs: string[];
    firm: {
      firmName: string;
      GSTNumber: string;
      address: {
        addessLine1: string;
        addessLine2: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
      },
      user: string;
      isDeleted: boolean,
      updatedBy: string;
      deletedBy: string;
      deletedAt: string;
      _id: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    },
    bank: string;
    creditLimit: number,
    referredUser: string;
    approved: boolean;
    approvedBy: string;
    status: string;
    isDeleted: boolean;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  },
  payment: {
    status: string;
    transportationCharges: number;
    _id: string;
    mode: string;
    modeTCS: number;
    modeTDS: number;
    modeFinal: number;
    modeComission: number;
    modeGSTOnComission: number;
    modeGSTOnProduct: number;
    seller: string;
    buyer: string;
    order: string;
  }
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) {}

  getOrder(params?: HttpParams) {
    return this.http.get(`${environment.ngRok}/order`, {params}) as Observable<{
      status: boolean;
      data: IOrder[];
      message?: string;
      pages: number;
      total: number;
    }>;
  }

  getSingleOrder(id: string) {
    return this.http.get(`${environment.ngRok}/order/order_details/${id}`) as Observable<{
      status: boolean;
      data: IOrder
    }>;
  }
}
