import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {
  
  readonly ROOT_URL : any;

  constructor(private http: HttpClient) { 
    this.ROOT_URL = "http://localhost:3000"
   }
  
  public uploadImage(image: File) {
    
    const formData = new FormData();

    formData.append('image', image);

    return this.http.post(`${this.ROOT_URL}/profile`, formData)
  }
  
}
