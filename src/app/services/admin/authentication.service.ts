import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ISignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'ADMIN';
  mobile: string;
}

export interface ILogin {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * use while admin login
   * @param d 
   * @returns 
   */
  login(d: ILogin) {

    return this.http.post(`${environment.ngRok}/signin`, d) as Observable<{
      status: boolean;
      data: {
        mobile: string;
        sellerRole: string;
        identityProofs: [];
        docs: [];
        firm: string;
        bank: string;
        creditLimit: number;
        referredUser: string;
        approved: boolean;
        status: string;
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        token: string;
      };
      message: string;
    }>;
  }

  registration(d: ISignUp) {

    return this.http.post(`${environment.ngRok}/signup`, d) as Observable<{
      message: string;
      data: {
        user: string;
      };
      status: boolean;
    }>;
  }
}
