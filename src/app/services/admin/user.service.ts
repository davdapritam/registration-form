import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IUser {
  PANNumber: string;
  approved: boolean;
  bank: {
    accountNumber: number;
    bankName: string;
    firm: string;
    ifscCode: string;
    user: string;
    _id: string;
  };
  creditLimit: number;
  docs: any[];
  email: string;
  firm: {
    GSTNumber: number;
    address: {
      addessLine1: string;
      addessLine2: string;
      city: string;
      country: string;
      pincode: string;
      state: string;
    };
    firmName: string;
    user: string;
    _id: string;
  };
  firstName: string;
  identityProofs: any[]
  lastName: string;
  mobile: string;
  referredUser: string;
  role: string;
  sellerRole: string;
  status: string;
  _id: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getUser(params: HttpParams) {
    return this.http.get(`${environment.ngRok}/user`, {params}) as Observable<{
      data: IUser[];
      status: boolean;
      message?: string;
      pages: number;
      total: number;
    }>;
  }

  getSingleUser(id: string | null) {

    return this.http.get(`${environment.ngRok}/user/${id}`) as Observable<{
      data: IUser;
      status: boolean;
      message?: string;
    }>
  }

  approveUser(id: string, d: {
    status: string,
    approved: boolean
  }) {
    return this.http.put(`${environment.ngRok}/user/update_status/${id}`, d) as Observable<{
      status: boolean;
      message?: string;
    }>;
  }

  updateCreditLimit(id: string, d: {creditLimit: number;}) {

    return this.http.put(`${environment.ngRok}/user/update_user_credit/${id}`, d) as Observable<{
      message: string;
      status: boolean;
    }>;
  }
}
