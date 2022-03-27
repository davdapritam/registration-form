import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { dashboardData } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  formValue!: FormGroup
  dashboardModelObj: dashboardData = new dashboardData;
  allData: any;

  constructor(private fromBuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.fromBuilder.group({
      name: [''],
      email: [''],
      mobile: [''],
      address: ['']
    })
    this.getAllData();
  }
  
    // Get all data
  getAllData(){
    this.api.getMethod().subscribe(res=>{
      this.allData = res;
    })
  }
  
  addDetail() {
    this.dashboardModelObj.name = this.formValue.value.name
    this.dashboardModelObj.email = this.formValue.value.email
    this.dashboardModelObj.mobile = this.formValue.value.mobile
    this.dashboardModelObj.address = this.formValue.value.address
    
    this.api.postMethod(this.dashboardModelObj).subscribe(res => {
      console.log(res);
      alert("Added Successfully!");
      this.getAllData();
    }, err => {
      alert("Somthing Went Wrong!");
    })
    
    this.formValue.reset();
  }
  
  deleteData(data:any){
    
    this.api.deleteMethod(data.id).subscribe(res=>{
      alert("Deleted Record!!");
      
      this.getAllData();
    })
  }
  
  editData(data:any){
    this.dashboardModelObj.id = data.id;
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['address'].setValue(data.address);
  }
  
  updateData(){
    this.dashboardModelObj.name = this.formValue.value.name
    this.dashboardModelObj.email = this.formValue.value.email
    this.dashboardModelObj.mobile = this.formValue.value.mobile
    this.dashboardModelObj.address = this.formValue.value.address
    
    this.api.updateMethod(this.dashboardModelObj, this.dashboardModelObj.id).subscribe(res=>{
      alert("Record Updated!!")
      
      let ref = document.getElementById('clear');
      ref?.click();
      this.formValue.reset();
      this.getAllData();
    })
    
  }
  
}
