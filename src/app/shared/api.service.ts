import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http:HttpClient) { }
  
  // Get post delete and all apis are store here
  
  // Post Method
  postMethod(data:any){
    return this._http.post<any>("http://localhost:3000/posts", data).pipe(map((res:any)=>{
      return res;
    }))
  };
  
  // Get Method
  getMethod(){
    
    return this._http.get<any>("http://localhost:3000/posts").pipe(map((res:any)=>{
      return res;
    }))
  }
  
  // UpdateMethod
  updateMethod(data:any, id:number){
    
    return this._http.put<any>("http://localhost:3000/posts/"+id, data).pipe(map((res:any)=>{
      return res;
    }))
  }
  
  // Delete Method
  deleteMethod(id:number){
    return this._http.delete<any>("http://localhost:3000/posts/"+ id).pipe(map((res:any)=>{
      return res;
    }))
  }
  
}
