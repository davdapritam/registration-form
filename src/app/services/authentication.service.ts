import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../environments/environment';

export interface Login {
  'email' : String,
  'password' : String
}

export interface Profile {
  GSTNumber: String,
  PANNumber: String,
  address: {
    addessLine1: String,
    city: String,
    country: String,
    pincode: String,
    state: String,
  },
  approved: boolean,
  approvedby: any,
  creditLimit: number,
  email: String,
  firmName: String,
  firstName: String,
  lastName: String,
  mobile: String,
  role: String,
  status: String,
  token: String,
  _id: String
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private profileObs = new BehaviorSubject<Profile | null>(null);

  constructor(private http: HttpClient, private router: Router, private toast: ToastrService ) { }

  // Login User
  login(data: Login): Observable<any> {
    return this.http.post(`${environment.serverUrl}/signIn`, data);
  }

  // Register User
  registration(data: any): Observable<any> {
    return this.http.post(`${environment.serverUrl}/signUp`, data);
  }

  // Edit Registration
  editRegistration(data: any): Observable<any> {
    return this.http.post(`${environment.serverUrl}/editRegistration`, data);
  }

  // Logout User
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  // Set User token
  setToken(token: any) {
    localStorage.setItem('authToken', token);
  }

  // Get User token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Get Profile
  getProfile(): Observable<Profile | null> {
    this.profileObs.subscribe(user => {
      if (!user) {
        let details = this.getUserDetails();
        this.setProfile(JSON.parse(details));
      }
    })
    return this.profileObs.asObservable();
  }

  // Set Profile
  setProfile(profile: Profile) {
    this.profileObs.next(profile);
  }

  // Manage successfull auth
  handleSuccessfullAuth(user: Profile) {
    localStorage.clear();
    this.setToken(user.token);
    this.setUserDetails(JSON.stringify(user));
    this.setProfile(user);
    if (user) {
      switch (user.role) {
        case 'SELLER': this.router.navigate(['/seller']);
          break;
        case 'BUYER': this.router.navigate(['/buyer']);
          break;
        case 'ADMIN': this.router.navigate(['admin', 'layout']);
          break;
        default: this.router.navigate(['/buyer']);
          break;
      }
    }
  }

  // Get User Profile from API
  getUserProfile() {
    this.http.get(`${environment.serverUrl}/profile`).subscribe((record: any) => {
      this.setProfile(record.data)
    }, err => {
      this.toast.error(err.message, 'Fail to fetch User\'s Profile');
    });
  }

  // Set User Details in local storage
  setUserDetails(data: string) {
    localStorage.setItem('userDetails', data);
  }

  // Get User Details from local storage
  getUserDetails() {
    return JSON.parse(JSON.stringify(localStorage.getItem('userDetails')));
  }

  // Upload user identity
  uploadUserIdentity(data: any): Observable<any> {
    return this.http.post(`${environment.serverUrl}/uploadIdentityProofs`, data);
  }

  // Upload user document
  uploadUserDocument(data: any): Observable<any> {
    return this.http.post(`${environment.serverUrl}/uploadUserDocs`, data);
  }

  // CONTINUE USER REGISTRATION
  continueRegistration(data: any): Observable<any> {
    return this.http.post(`${environment.serverUrl}/continueApplication`, data);
  }

  // Identity document update
  identityImageUpdate(data: any, id: string): Observable<any> {
    return this.http.put(`${environment.serverUrl}/updateProof/` + id, data);
  }


  // Get User Profile from API
  getSellerProfile() : Observable<any> {
    return this.http.get(`${environment.serverUrl}/profile`);
  }
}
