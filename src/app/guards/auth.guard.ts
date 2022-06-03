import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthenticationService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let isAuthenticated = false;
    this.auth.getProfile().subscribe(profile => {
      if (!profile) {
        this.router.navigate(['/']);
        isAuthenticated =  false;
      } else {
        isAuthenticated = true;
        if (!route.data.role.includes(profile.role)) {
          this.router.navigate(['/noAccess']);
        }
        if (profile.status !== 'active' && route.data.checkStatus) {
          this.router.navigate(['/forbiddenAccess']);
        }
      }
    })
    return isAuthenticated;
  };

}
