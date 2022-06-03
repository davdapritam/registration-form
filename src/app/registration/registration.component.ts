import { ContinueRegistrationDialogComponent } from './continue-registration-dialog/continue-registration-dialog.component';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { errorHandler } from '../shared/validators/errorHandler';
import { isAlphabates, hasLength, isNumber } from '../shared/validators/customValidation';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import Stepper from 'bs-stepper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../shared/components/alert-modal/alert-modal.component';
import * as bankList from '../../assets/files/bankList.json';
import { Subscription } from 'rxjs';
import { Globals } from '../globals';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  userDetailsForm: FormGroup;
  firmDetailsForm: FormGroup;
  errorHandler = errorHandler;
  businessProof = 'IT Return';
  stepper: any;
  panSrc: any;
  aadharFrontSrc: any;
  aadharBackSrc: any;
  panFile: any;
  aadharFrontFile: any;
  aadharBackFile: any;
  imagePreviewURL: any;
  businessProofFile: any;
  authorizedSignature: any;
  isAgreementAccepted: boolean = false;
  hidePassword: boolean = false;
  bankList: any = [];
  insertBankName: boolean = false;
  isUserFirmDetailSave = false;

  subs: Subscription;

  uploadFileName: any = {};
  identityDocument: any = {};

  constructor(
    private toast: ToastrService,
    private auth: AuthenticationService,
    private modalService: NgbModal,
    public router: Router
  ) {

    this.subs = new Subscription();

    this.userDetailsForm = new FormGroup({
      'firstName': new FormControl('', [Validators.required, Validators.minLength(2), isAlphabates]),
      'lastName': new FormControl('', [Validators.required, Validators.minLength(2), isAlphabates]),
      'email': new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
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
  }

  ngOnInit(): void {
    this.stepper = new Stepper(document.querySelector('#userRegistration')  as HTMLCanvasElement, {
      linear: false,
      animation: true
    });
    this.bankList = (bankList as any).default;
    this.firmDetailsForm.addControl('bankName', new FormControl(this.bankList[0], Validators.required));
    localStorage.clear();
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

    if (localStorage.getItem('isEdit') === 'true' && (id === 'panUploader' || id === 'aadharFrontUploader' || id === 'aadharBackUploader')){

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

      this.auth.identityImageUpdate(Globals.jsonToFormData(data), imageId).subscribe(() => {});
    }
  }

  fileBrowseHandler(event: any, id: string): void {
    console.log(':: event', event);
    const file = event.target.files[0];
    this.handleFile(file, id);
  }

  onFileDropped(event: any, id: string): void {
    const file = event.dataTransfer.files[0];
    this.handleFile(file, id);
  }

  selectBank(event: any): void {
    if (event.target.value === 'OTHER') {
      this.firmDetailsForm.patchValue({ 'bankName': '' });
      this.insertBankName = true
    } else {
      this.insertBankName = false;
    }
  }

  toggleSellerRole() {
    this.userDetailsForm.controls['sellerRole'].value === 'TRADER' ?
    this.userDetailsForm.patchValue({ 'sellerRole': 'MANUFACTURER' }) : this.userDetailsForm.patchValue({ 'sellerRole': 'TRADER' });
    this.businessProof = this.userDetailsForm.controls['sellerRole'].value === 'MANUFACTURER' ? 'Manufacturing Certificate' : 'Authorized Product Seller Certificate';
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

  toggleReferal() {
    if (this.userDetailsForm.controls['haveReferalCode'].value === 'Yes') {
      this.userDetailsForm.patchValue({ 'haveReferalCode': 'No' });
      this.userDetailsForm.removeControl('referalCode');
    } else {
      this.userDetailsForm.patchValue({ 'haveReferalCode': 'Yes' });
      this.userDetailsForm.addControl('referalCode', new FormControl('', [Validators.required, hasLength(6)]));
    }
  }

  uploadIdentity() {

    if (localStorage.getItem('isEdit') === 'true'){
      !this.userDetailsForm.valid || !this.isAgreementAccepted ? this.blockNavigation(1) : !this.firmDetailsForm.valid ? this.blockNavigation(2) : (!this.panFile || !this.aadharFrontFile || !this.aadharBackFile) ? this.stepper.to(3) : this.stepper.to(4);
      return;
    }
    // !this.userDetailsForm.valid || !this.isAgreementAccepted ? this.blockNavigation(1) : !this.firmDetailsForm.valid ? this.blockNavigation(2) : (!this.panFile || !this.aadharFrontFile || !this.aadharBackFile) ? this.stepper.to(3) : this.stepper.to(4);
    if (!(!this.panFile || !this.aadharFrontFile || !this.aadharBackFile)){

      const modalRef = this.modalService.open(AlertModalComponent, {backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, keyboard: false });
      modalRef.componentInstance.title = 'Processing Data';
      modalRef.componentInstance.message = 'Do not hit back in your browser or refresh your screen. This screen will disappear as soon as the data will saved.';
      let flag = false;
      if (localStorage.getItem('user')){
        const data: any = {
          userId: localStorage.getItem('user')
        };

        if (typeof this.panFile === 'object'){
          data['panCard'] = this.panFile;
          flag = true;
        }
        if (typeof this.aadharFrontFile === 'object'){
          data['aadharCardFront'] = this.aadharFrontFile;
          flag = true;
        }
        if (typeof this.aadharBackFile === 'object'){
          data['aadharCardBack'] = this.aadharBackFile;
          flag = true;
        }

        this.auth.uploadUserIdentity(Globals.jsonToFormData(data)).subscribe(response => {
          if (response.status){
            !this.userDetailsForm.valid || !this.isAgreementAccepted ? this.blockNavigation(1) : !this.firmDetailsForm.valid ? this.blockNavigation(2) : (!this.panFile || !this.aadharFrontFile || !this.aadharBackFile) ? this.stepper.to(3) : this.stepper.to(4);
            this.toast.success('User identity uploaded successfully.');
          }else{
            this.toast.error('Please upload valid file.');
          }
          modalRef.close();
        });
      }else{
        modalRef.close();
        this.toast.error('Please upload valid file.');
      }
    }else{
      this.toast.error('Please select or upload document');
    }
  }

  uploadBusinessProof() {
    // localStorage.clear();
    console.log(this.businessProofFile);
    console.log(this.authorizedSignature);

    const data: any = {
      userId: localStorage.getItem('user')
    };

    const modalRef = this.modalService.open(AlertModalComponent, {backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, keyboard: false });
    modalRef.componentInstance.title = 'Processing Data';
    modalRef.componentInstance.message = 'Do not hit back in your browser or refresh your screen. This screen will disappear as soon as the data will saved.';

    if (this.userDetailsForm.controls['role'].value==='SELLER'){
      if (this.businessProofFile && this.authorizedSignature){
        data['certificate'] = this.businessProofFile;
        data['signature'] = this.authorizedSignature;
      }else{
        this.toast.error('Please upload valid file.');
        return;
      }
    }else{
      if (this.businessProofFile){
        data['certificate'] = this.businessProofFile;
      }else{
        this.toast.error('Please upload valid file.');
        return;
      }
    }
    this.auth.uploadUserDocument(Globals.jsonToFormData(data)).subscribe(response => {
      if (response.status){
        localStorage.clear();
        this.toast.success('User document uploaded successfully. please login after approve your account.');
        this.router.navigate(['/login']);
      }else{
        this.toast.error('Please upload valid file.');
      }
      modalRef.close();
    });
  }

  blockNavigation(step: number) {
    this.stepper.to(step);
    this.toast.error('Please complete this step first', 'Navigation Blocked');
  }

  userDetailsSubmit() {
    console.log(this.userDetailsForm.value);

    this.userDetailsForm.valid && this.isAgreementAccepted ? this.stepper.to(2) : this.blockNavigation(1);
  }

  firmDetailsSubmit() {
    this.firmDetailsForm.markAllAsTouched();
    if (this.firmDetailsForm.valid) {
      const pFC = this.firmDetailsForm.get('address')?.get('pincode');
      pFC?.setValue(String(pFC.value));
      const acFC = this.firmDetailsForm.get('accountNumber');
      acFC?.setValue(String(acFC.value));
      const modalRef = this.modalService.open(AlertModalComponent, {backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, keyboard: false });
      modalRef.componentInstance.title = 'Processing Data';
      modalRef.componentInstance.message = 'Do not hit back in your browser or refresh your screen. This screen will disappear as soon as the data will saved.';
      let userId = localStorage.getItem('user');
      if (userId) {
        this.auth.editRegistration({...this.userDetailsForm.value, ...this.firmDetailsForm.value, userId}).subscribe((response) => {
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
        this.auth.registration({...this.userDetailsForm.value, ...this.firmDetailsForm.value}).subscribe(response => {
          modalRef.close();
          if (response && response.status){
            localStorage.setItem('user', response.data?.user)
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
    } else if (!this.userDetailsForm.valid || !this.isAgreementAccepted) {
      this.blockNavigation(1);
    } else {
      this.blockNavigation(2);
    }
  }

  get address() {
    return this.firmDetailsForm.controls.address as FormGroup;
  }

  continueRegistration(): void{
    const modalRef = this.modalService.open(ContinueRegistrationDialogComponent, {backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, keyboard: false });
    modalRef.result.then((result) => {
      if (result) {
        this.fillDataContinueRegistration(result.data);
      }
    });
  }


  fillDataContinueRegistration(value: any): void{
    localStorage.setItem('user', value._id);
    this.userDetailsForm.get('firstName')?.setValue(value.firstName);
    this.userDetailsForm.get('lastName')?.setValue(value.lastName);
    this.userDetailsForm.get('email')?.setValue(value.email);
    this.userDetailsForm.get('mobile')?.setValue(value.mobile);
    this.userDetailsForm.get('role')?.setValue(value.role);
    this.userDetailsForm.get('password')?.setValue(value.password);

    if(this.userDetailsForm.controls['role'].value === 'SELLER') {
      this.userDetailsForm.addControl('haveReferalCode', new FormControl('No', Validators.required));
      this.userDetailsForm.addControl('sellerRole', new FormControl(value.sellerRole, Validators.required));
     } else {
      this.userDetailsForm.removeControl('haveReferalCode');
      this.userDetailsForm.removeControl('sellerRole');
      this.userDetailsForm.removeControl('referalCode');
    }

    this.firmDetailsForm.get('firmName')?.setValue(value.firm.firmName);
    this.firmDetailsForm.get('GSTNumber')?.setValue(value.firm.GSTNumber);
    this.firmDetailsForm.get('PANNumber')?.setValue(value.PANNumber);
    this.firmDetailsForm.get('accountNumber')?.setValue(value.bank.accountNumber);
    this.firmDetailsForm.get('ifscCode')?.setValue(value.bank.ifscCode);

    const addressControl = this.firmDetailsForm.get('address');
    addressControl?.get('addessLine1')?.setValue(value.firm.address.addessLine1);
    addressControl?.get('addessLine2')?.setValue(value.firm.address.addessLine2);
    addressControl?.get('city')?.setValue(value.firm.address.city);
    addressControl?.get('country')?.setValue(value.firm.address.country);
    addressControl?.get('pincode')?.setValue(value.firm.address.pincode);
    addressControl?.get('state')?.setValue(value.firm.address.state);

    this.isAgreementAccepted = true;

    value.identityProofs.forEach((element: any) => {
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
  }
}
