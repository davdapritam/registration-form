import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { errorHandler } from '../shared/validators/errorHandler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorHandler = errorHandler;
  hidePassword: boolean = false;
  
  constructor(private toast: ToastrService, private auth: AuthenticationService) {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)])
    });
  }
  
  ngOnInit(): void {
  }

  formSubmit() {
    this.auth.login(this.loginForm.value).subscribe(response => {
      this.toast.success('Login Successfully');
      this.auth.handleSuccessfullAuth(response.data);
    }, err => {
      this.toast.error(err.message, 'Login Failed');
    })
  }
  
}
