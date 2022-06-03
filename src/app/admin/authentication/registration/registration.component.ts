import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AuthenticationService, ISignUp } from 'src/app/services/admin/authentication.service';
import { email, required } from 'src/app/services/utility';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit {

  //handle password visiblity flag 
  passwordShow: boolean = false;
  confirmPasswordShow: boolean = false;

  // hold the form object
  registrationForm: FormGroup;

  // hold the subscription
  subs: Subscription;

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    public router: Router
  ) {

    this.subs = new Subscription();

    this.registrationForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobile: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required, this.confirmPasswordValidator()])
    });

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})));
  }

  ngOnInit(): void {
  }

  onRegistration(): void {

    this.registrationForm.markAsTouched();

    if (this.registrationForm.valid) {
      
      const formData = this.registrationForm.getRawValue();

      const payload: ISignUp = formData;

      payload.role = 'ADMIN';

      const subs = this.authenticationService.registration(payload).subscribe({
        next: (v) => {
          if (v.status) {
            this.toastrService.success(v.message);
            this.registrationForm.reset();
            this.router.navigate(['/', 'admin', 'auth']);
          } else {
            this.toastrService.success(v.message);
          }
        },
        error: (v) => {
          this.toastrService.error(v.message);
        }
      });

      this.subs.add(subs);
    }
  }

  firstNameErrorFn(): string | null {

    const ctrl = this.registrationForm.get('firstName');

    return ctrl?.hasError(required) ? 'First name is required' : null;
  }

  lastNameErrorFn(): string | null {

    const ctrl = this.registrationForm.get('lastName');

    return ctrl?.hasError(required) ? 'Last name is required' : null;
  }

  emailErrorFn(): string | null {

    const ctrl = this.registrationForm.get('email');

    return ctrl?.hasError(required) ? 'Email is required' :
    ctrl?.hasError(email) ? 'Email pattern is invalid' : null;
  }

  mobileErrorFn(): string | null {

    const ctrl = this.registrationForm.get('mobile');

    return ctrl?.hasError(required) ? 'Mobile number is required' : null;
  }

  passwordErrorFn(): string | null {

    const ctrl = this.registrationForm.get('password');

    return ctrl?.hasError(required) ? 'Password is required' : null;
  }

  confirmPasswordErrorFn(): string | null {

    const ctrl = this.registrationForm.get('confirmPassword');

    return ctrl?.hasError(required) ? 'Confirm Password is required' :
    ctrl?.hasError('password_not_match') ? `Password doesn't match` : null;
  }

  confirmPasswordValidator(): ValidatorFn {

    return (ctrl: AbstractControl): ValidationErrors | null => {

      if (!!this.registrationForm) {

        const passwordValue = this.registrationForm.get('password')?.value;
        const confirmPasswordValue = ctrl.value;
  
        if (passwordValue === null || passwordValue?.trim() === '' || confirmPasswordValue === null || confirmPasswordValue?.trim() === '') {
          return null;
        }
  
        if (passwordValue !== confirmPasswordValue) {
          return {password_not_match: true};
        }
  
        return null;
      }

      return null;
    }
  }
}
