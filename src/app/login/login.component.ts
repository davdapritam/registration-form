import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder:FormBuilder, private _http:HttpClient, private router:Router) { }
  
  loginForm!:FormGroup

  ngOnInit(): void {
    
    this.loginForm = new FormGroup({
      'email':new FormControl(null, [Validators.required, Validators.email]),
      'password':new FormControl(null, Validators.required)
    })
  }
  
  logIn(){
    this._http.get<any>("http://localhost:3000/SignUP").subscribe(res=>{
      const user = res.find((a : any) => {
        return a.email === this.loginForm.value.email && a.password === this.loginForm.value.password
      })
      if (user) {
        alert("Logged In SuccessFully");
        this.loginForm.reset();
        this.router.navigate(['dashboard']);
      }else{
        alert("User Not Found");
      }
    }, err=>{
      alert("Something Went Wrong");
    })
  }
}
