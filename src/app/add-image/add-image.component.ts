import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ImageServiceService } from '../image-service.service';


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';
  
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent implements OnInit {
  
  selectedFile: ImageSnippet ;
  isLogin:any;
  candidate:any;
  resumeForm!:FormGroup;
  CityWithoutFilter:any;
  StateWithoutFilter:any;
  states:any;
  cities:any;

  image!:string;
  profile!:string;
  profileError=false;
  profileSize!:number;
  
  
  profileUploader:FileUploader = new FileUploader({url:"http://localhost:3000/profile"});

  constructor(private imageService : ImageServiceService) { }

  ngOnInit(): void {
  }
  
  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }
  
  private onError(){
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  
  processFile(imageInput : any){
    
    const file : File = imageInput.files[0];
    const reader = new FileReader();
    
    reader.addEventListener('load', (event: any) => {
      
      this.selectedFile = new ImageSnippet(event.target.result, file);
      
      this.selectedFile.pending = true;
      
      this.imageService.uploadImage(this.selectedFile.file).subscribe((res) => {
        this.onSuccess();
      }, (err) => {
        this.onError();
      });
      
    });
    
    reader.readAsDataURL(file);
    
  }
  
  
  onProfileChange(event:any){ 
    const file=event.target.files[0];
    const types=['image/png','image/jpeg','image/jpg'];
    if(types.includes(file.type))
    {
      const reader=new FileReader();
      reader.onload=()=>{
        this.image=reader.result as string;
      }
      reader.readAsDataURL(file);

      this.profileError=false;
      this.profile=file.name;
      this.profileSize=event.target.files[0].size/1024/1024;
      if(this.profileSize>1)//1mb
      {
        this.profileError=true;
        this.profile="Profile Image is greater than 1 mb. Please select other";
      }
    }else{
      this.profileError=true;
      this.profile="Selected File is not .png/.jpg/.jpeg"
    }
  }
  
  
}
