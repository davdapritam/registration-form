import { AuthenticationService } from './../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { errorHandler } from 'src/app/shared/validators/errorHandler';

@Component({
  selector: 'app-continue-registration-dialog',
  templateUrl: './continue-registration-dialog.component.html',
  styleUrls: ['./continue-registration-dialog.component.css']
})
export class ContinueRegistrationDialogComponent implements OnInit {

  loginForm: FormGroup;
  hidePassword: boolean = false;
  errorHandler = errorHandler;

  constructor(
    public activeModal: NgbActiveModal,
    private toast: ToastrService,
    private auth: AuthenticationService
  ) {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)])
    });
  }

  ngOnInit(): void {
  }

  dialogClose(): void{
    this.activeModal.close(false);
  }

  formSubmit() {

    this.auth.continueRegistration(this.loginForm.value).subscribe(response => {
      // this.toast.success('Login Successfully');
      // this.auth.handleSuccessfullAuth(response.data);
      if (response.status){
        response.data['password'] = this.loginForm.get('password')?.value;
        localStorage.setItem('isEdit', 'true');
        this.activeModal.close(response);
      }else{
        this.toast.error('Please enter valid credential.', 'Login Failed');
      }
    }, err => {
      this.toast.error(err.message, 'Login Failed');
    });
  }
}
