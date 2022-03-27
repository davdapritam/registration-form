import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!:FormGroup
  
  constructor(private formBuilder:FormBuilder, private _http:HttpClient, private router:Router) { }

  ngOnInit(): void {
  
    this.signupForm = new FormGroup({
      'name':new FormControl(null, Validators.required),
      'email':new FormControl(null, [Validators.required, Validators.email]),
      'password':new FormControl(null, Validators.required)
    })
  }
  
  signUp(){
    this._http.post<any>("http://localhost:3000/SignUP", this.signupForm.value).subscribe(res=>{
      alert("Registration Done!");
      this.signupForm.reset();
      this.router.navigate(['login']);
    }, err=>{
      alert("Something Went Wrong!");
    })
  }
}
