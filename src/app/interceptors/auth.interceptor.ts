import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private auth: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });
    return next.handle(request)
    .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if(event && event.status === 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status && error.status === 401) {
          localStorage.clear();
          this.router.navigate(['/']);
        }
        return throwError(error.error);
      })
    )
  }
};
