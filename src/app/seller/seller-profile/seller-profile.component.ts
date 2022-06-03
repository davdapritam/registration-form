import { Router } from '@angular/router';
import { AlertModalComponent } from './../../shared/components/alert-modal/alert-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../services/authentication.service';
import Stepper from 'bs-stepper';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { hasLength, isAlphabates, isNumber } from 'src/app/shared/validators/customValidation';
import { errorHandler } from 'src/app/shared/validators/errorHandler';
import * as bankList from '../../../assets/files/bankList.json';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css']
})
export class SellerProfileComponent implements OnInit {


  userDetailsForm: FormGroup;
  firmDetailsForm: FormGroup;
  errorHandler = errorHandler;
  stepper: any;
  businessProof = 'IT Return';
  bankList: any = [];
  insertBankName: boolean = false;
  identityDocument: any = {};
  uploadFileName: any = {};
  userDoc: any = {
    certificate: [],
    signature: []
  };
  panSrc: any;
  aadharFrontSrc: any;
  aadharBackSrc: any;
  panFile: any;
  aadharFrontFile: any;
  aadharBackFile: any;
  imagePreviewURL: any;
  businessProofFile: any;
  authorizedSignature: any;

  get address() {
    return this.firmDetailsForm.controls.address as FormGroup;
  }

  constructor(
    private authenticationService: AuthenticationService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.userDetailsForm = new FormGroup({
      'firstName': new FormControl('', [Validators.required, Validators.minLength(2), isAlphabates]),
      'lastName': new FormControl('', [Validators.required, Validators.minLength(2), isAlphabates]),
      'email': new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'role': new FormControl('BUYER', Validators.required),
      'mobile': new FormControl('', [Validators.required, hasLength(10), isNumber])
    });
    this.firmDetailsForm = new FormGroup({
      'firmName': new FormControl('', [Validators.required, Validators.minLength(2)]),
      'GSTNumber': new FormControl('', [Validators.required, hasLength(15)]),
      'PANNumber': new FormControl('', [Validators.required, hasLength(10)]),
      'accountNumber': new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(16), isNumber]),
      'ifscCode': new FormControl('', [Validators.required, hasLength(11)]),
      'address': new FormGroup({
        'addessLine1': new FormControl('', [Validators.required, Validators.minLength(2)]),
        'addessLine2': new FormControl(''),
        'city': new FormControl('Surat', [Validators.required, Validators.minLength(2)]),
        'state': new FormControl('Gujarat', [Validators.required, Validators.minLength(2)]),
        'country': new FormControl('India', [Validators.required, Validators.minLength(2)]),
        'pincode': new FormControl('', [Validators.required, hasLength(6), isNumber])
      })
    });

    this.getDefaultData();
  }

  ngOnInit(): void {
    this.stepper = new Stepper(document.querySelector('#userRegistration')  as HTMLCanvasElement, {
      linear: false,
      animation: true
    });

    this.bankList = (bankList as any).default;
    this.firmDetailsForm.addControl('bankName', new FormControl(this.bankList[0], Validators.required));
  }

  getDefaultData(): void{
    this.authenticationService.getSellerProfile().subscribe((value: any) => {
      console.log('::::::::::::::::::::::::::::RES', value);

      const userDetail = value.data;
      localStorage.setItem('user', userDetail._id);
      this.userDetailsForm.get('firstName')?.setValue(userDetail.firstName);
      this.userDetailsForm.get('lastName')?.setValue(userDetail.lastName);
      this.userDetailsForm.get('email')?.setValue(userDetail.email);
      this.userDetailsForm.get('mobile')?.setValue(userDetail.mobile);
      this.userDetailsForm.get('role')?.setValue(userDetail.role);
      this.userDetailsForm.get('password')?.setValue(userDetail.password);

      if(this.userDetailsForm.controls['role'].value === 'SELLER') {
        this.userDetailsForm.addControl('haveReferalCode', new FormControl('No', Validators.required));
        this.userDetailsForm.addControl('sellerRole', new FormControl(userDetail.sellerRole, Validators.required));
      } else {
        this.userDetailsForm.removeControl('haveReferalCode');
        this.userDetailsForm.removeControl('sellerRole');
        this.userDetailsForm.removeControl('referalCode');
      }

      this.firmDetailsForm.get('firmName')?.setValue(userDetail.firm.firmName);
      this.firmDetailsForm.get('GSTNumber')?.setValue(userDetail.firm.GSTNumber);
      this.firmDetailsForm.get('PANNumber')?.setValue(userDetail.PANNumber);
      this.firmDetailsForm.get('bankName')?.setValue(userDetail.bank.bankName);
      this.firmDetailsForm.get('accountNumber')?.setValue(userDetail.bank.accountNumber);
      this.firmDetailsForm.get('ifscCode')?.setValue(userDetail.bank.ifscCode);

      const addressControl = this.firmDetailsForm.get('address');
      addressControl?.get('addessLine1')?.setValue(userDetail.firm.address.addessLine1);
      addressControl?.get('addessLine2')?.setValue(userDetail.firm.address.addessLine2);
      addressControl?.get('city')?.setValue(userDetail.firm.address.city);
      addressControl?.get('country')?.setValue(userDetail.firm.address.country);
      addressControl?.get('pincode')?.setValue(userDetail.firm.address.pincode);
      addressControl?.get('state')?.setValue(userDetail.firm.address.state);

      userDetail.identityProofs.forEach((element: any) => {
        if (element.proofType === "panCard"){
          this.panFile = this.panSrc = element.url;
          this.identityDocument['panCard'] = element._id;
        }else if (element.proofType === "aadharCardFront"){
          this.aadharFrontFile = this.aadharFrontSrc = element.url;
          this.identityDocument['aadharCardFront'] = element._id;
        }else if (element.proofType === "aadharCardBack"){
          this.aadharBackFile = this.aadharBackSrc = element.url;
          this.identityDocument['aadharCardBack'] = element._id;
        } else {
          this.authorizedSignature = element.url;
        }
      this.uploadFileName[element.proofType] = element.originalname;
      });

      userDetail.docs.forEach((doc: any) => {
        console.log('*************************1', doc);
        this.userDoc[doc.docType] = doc;
      });
    });
  }

  toggleRole() {
    this.userDetailsForm.controls['role'].value === 'BUYER' ?
    this.userDetailsForm.patchValue({ 'role': 'SELLER' }) : this.userDetailsForm.patchValue({ 'role': 'BUYER' });
    this.businessProof = this.userDetailsForm.controls['role'].value === 'BUYER' ? 'IT Return' : 'Authorized Product Seller Certificate';
    if(this.userDetailsForm.controls['role'].value === 'SELLER') {
      this.userDetailsForm.addControl('haveReferalCode', new FormControl('Yes', Validators.required));
      this.userDetailsForm.addControl('sellerRole', new FormControl('TRADER', Validators.required));
      this.userDetailsForm.addControl('referalCode', new FormControl('', [Validators.required, hasLength(6)]));
    } else {
      this.userDetailsForm.removeControl('haveReferalCode');
      this.userDetailsForm.removeControl('sellerRole');
      this.userDetailsForm.removeControl('referalCode');
    }
  }

  toggleSellerRole() {
    this.userDetailsForm.controls['sellerRole'].value === 'TRADER' ?
    this.userDetailsForm.patchValue({ 'sellerRole': 'MANUFACTURER' }) : this.userDetailsForm.patchValue({ 'sellerRole': 'TRADER' });
    this.businessProof = this.userDetailsForm.controls['sellerRole'].value === 'MANUFACTURER' ? 'Manufacturing Certificate' : 'Authorized Product Seller Certificate';
  }

  toggleReferal() {
    if (this.userDetailsForm.controls['haveReferalCode'].value === 'Yes') {
      this.userDetailsForm.patchValue({ 'haveReferalCode': 'No' });
      this.userDetailsForm.removeControl('referalCode');
    } else {
      this.userDetailsForm.patchValue({ 'haveReferalCode': 'Yes' });
      this.userDetailsForm.addControl('referalCode', new FormControl('', [Validators.required, hasLength(6)]));
    }
  }

  selectBank(event: any): void {
    if (event.target.value === 'OTHER') {
      this.firmDetailsForm.patchValue({ 'bankName': '' });
      this.insertBankName = true
    } else {
      this.insertBankName = false;
    }
  }

  onFileDropped(event: any, id: string): void {
    const file = event.dataTransfer.files[0];
    this.handleFile(file, id);
  }

  handleFile(file: any, id: string) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    switch (id) {
      case 'panUploader': reader.onload = e =>  {
        this.panFile = file;
        this.panSrc = reader.result;
        this.imagePreviewURL = this.panSrc;
        this.editedFileUpload(id);
      };
      break;
      case 'aadharFrontUploader': reader.onload = e =>  {
        this.aadharFrontFile = file;
        this.aadharFrontSrc = reader.result;
        this.imagePreviewURL = this.aadharFrontSrc;
        this.editedFileUpload(id);

      };
      break;
      case 'aadharBackUploader': reader.onload = e =>  {
        this.aadharBackFile = file;
        this.aadharBackSrc = reader.result,
        this.imagePreviewURL = this.aadharBackSrc;
        this.editedFileUpload(id);
      };
      break;
      case 'authorizedSignatureUploader': reader.onload = e =>  {
        this.authorizedSignature = file;
      };
      break;
      default: this.businessProofFile = file
      break;
    }


    // if (localStorage.getItem('isEdit') === 'true' && (id === 'panUploader' || id === 'aadharFrontUploader' || id === 'aadharBackUploader')){
    //   console.log('Edit mode on');
    //   this.editedFileUpload(id);
    // }
  }

  editedFileUpload(id: string): void{

    if ((id === 'panUploader' || id === 'aadharFrontUploader' || id === 'aadharBackUploader')){

      let imageId = '';
      const data: any = {
        userId: localStorage.getItem('user'),
      }

      if (id === 'panUploader'){
        imageId = this.identityDocument['panCard'];
        data['panCard'] = this.panFile;
      } else if (id === 'aadharFrontUploader') {
        imageId = this.identityDocument['aadharCardFront'];
        data['aadharCardFront'] = this.aadharFrontSrc;
      } else if (id === 'aadharBackUploader') {
        imageId = this.identityDocument['aadharCardBack'];
        data['aadharCardBack'] = this.aadharBackSrc;
      }
      this.authenticationService.identityImageUpdate(Globals.jsonToFormData(data), imageId).subscribe(() => {});
    }
  }

  fileBrowseHandler(event: any, id: string): void {
    const file = event.target.files[0];
    this.handleFile(file, id);
  }

  userDetailsSubmit(): void{
    this.userDetailsForm.valid ? this.stepper.to(2) : this.blockNavigation(1);
  }

  blockNavigation(step: number) {
    this.stepper.to(step);
    this.toast.error('Please complete this step first', 'Navigation Blocked');
  }

  firmDetailsSubmit() {
    if (this.firmDetailsForm.valid) {
      const modalRef = this.modalService.open(AlertModalComponent, {backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, keyboard: false });
      modalRef.componentInstance.title = 'Processing Data';
      modalRef.componentInstance.message = 'Do not hit back in your browser or refresh your screen. This screen will disappear as soon as the data will saved.';
      let userId = localStorage.getItem('user');
      if (userId) {
        this.authenticationService.editRegistration({...this.userDetailsForm.value, ...this.firmDetailsForm.value, userId}).subscribe((response) => {
          modalRef.close();
          if (response && response.status){
            this.toast.success(response.message);
            this.stepper.to(3);
          } else {
            this.toast.error(response.message, 'Edit Registration Failed');
          }
        }, err => {
          modalRef.close();
          this.toast.error(err.message, 'Signup Failed');
        });
      } else {
        this.authenticationService.registration({...this.userDetailsForm.value, ...this.firmDetailsForm.value}).subscribe(response => {
          modalRef.close();
          if (response && response.status){
            this.toast.success(response.message);
            localStorage.setItem('user', response.data.user);
            this.stepper.to(3);
          } else {
            this.toast.error(response.message, 'Signup Failed');
          }
        }, err => {
          modalRef.close();
          this.toast.error(err.message, 'Signup Failed');
        });
      }
    } else if (!this.userDetailsForm.valid) {
      this.blockNavigation(1);
    } else {
      this.blockNavigation(2);
    }
  }

  uploadBusinessProof() {
    // // localStorage.clear();
    // console.log(this.businessProofFile);
    // console.log(this.authorizedSignature);

    // const data: any = {
    //   userId: localStorage.getItem('user')
    // };

    // const modalRef = this.modalService.open(AlertModalComponent, {backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, keyboard: false });
    // modalRef.componentInstance.title = 'Processing Data';
    // modalRef.componentInstance.message = 'Do not hit back in your browser or refresh your screen. This screen will disappear as soon as the data will saved.';

    // if (this.userDetailsForm.controls['role'].value==='SELLER'){
    //   if (this.businessProofFile && this.authorizedSignature){
    //     data['certificate'] = this.businessProofFile;
    //     data['signature'] = this.authorizedSignature;
    //   }else{
    //     this.toast.error('Please upload valid file.');
    //     return;
    //   }
    // }else{
    //   if (this.businessProofFile){
    //     data['certificate'] = this.businessProofFile;
    //   }else{
    //     this.toast.error('Please upload valid file.');
    //     return;
    //   }
    // }
    // this.authenticationService.uploadUserDocument(Globals.jsonToFormData(data)).subscribe(response => {
    //   if (response.status){
    //     this.toast.success('User document uploaded successfully. please login after approve your account.');
    //     this.router.navigate(['/seller/profile']);
    //   }else{
    //     this.toast.error('Please upload valid file.');
    //   }
    //   modalRef.close();
    // });
  }

  continueRegistration(): void{

  }

  uploadIdentity(): void{

  }

  checkForm(): void{
    console.log(':::::::::::::aaa', this.userDetailsForm);
  }
}
