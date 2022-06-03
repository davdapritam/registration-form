import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/admin/authentication.service';
import { email, required } from 'src/app/services/utility';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  //handle password visiblity flag 
  passwordShow: boolean = false;

  // hold the form object
  loginForm: FormGroup;

  // hold the subscription
  subs: Subscription;

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  // hold the api flag
  isApiCalling: boolean = false;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    public router: Router,
    public cd: ChangeDetectorRef
  ) {

    this.subs = new Subscription();

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})));
  }

  ngOnInit(): void {
  }

  login(): void {

    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {

      this.isApiCalling = true;

      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: (v) => {
          if (v.status) {
            this.toastrService.success('Login Successfully');
            this.loginForm.reset();
            localStorage.setItem('authToken', v.data.token);
            this.router.navigate(['/', 'admin', 'layout', 'user'])
          } else {
            this.toastrService.error(v.message);
          }
          this.isApiCalling = false;
          this.cd.markForCheck();
        },
        error: (v) => {
          this.toastrService.error(v.message);
          this.isApiCalling = false;
          this.cd.markForCheck();
        }
      });
    }
  }

  emailErrorFn(): string | null {

    const ctrl = this.loginForm.get('email');

    return ctrl?.hasError(required) ? 'Email is required' :
    ctrl?.hasError(email) ? 'Email pattern is invalid' : null;
  }
}
