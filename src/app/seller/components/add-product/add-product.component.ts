import { Globals } from './../../../globals';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import Stepper from 'bs-stepper';
import { isNumber, isDecimal } from '../../../shared/validators/customValidation';
import { errorHandler } from '../../../shared/validators/errorHandler';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/products/product.service';
import { CalculateComissionPipe } from 'src/app/pipes/calculate-comission.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductImageComponent } from '../product-image/product-image.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [CalculateComissionPipe]
})
export class AddProductComponent implements OnInit {

  stepper: any;
  productDetailsForm: FormGroup;
  // priceDetailsForm: FormGroup;
  productCategoryList: Array<{_id: string, name: string}> = [];
  productQualityList: Array<{_id: string, name: string, category: string}> = [];
  errorHandler = errorHandler;
  customQuality: boolean = false;
  colours: Array<string> = [];
  products: Array<string> = [];
  productImages: any = [];
  productImagesFile: any = [];
  removePriceDetails: any = [];


  priceDetailsFormGroup: FormGroup;
  get getProduct(): AbstractControl[]{
    return (this.priceDetailsFormGroup.get('priceDetail') as FormArray).controls as AbstractControl[];
  }

  constructor(
    private product: ProductService,
    private toast: ToastrService,
    private calculateComission: CalculateComissionPipe,
    private modalService: NgbModal,
    private router: Router
    ) {

    this.priceDetailsFormGroup = new FormGroup({
      priceDetail: new FormArray([])
    });

    this.productDetailsForm = new FormGroup({
      productCategory: new FormControl('', Validators.required),
      productName: new FormControl('', Validators.required),
      productQuality: new FormControl('', [Validators.required, Validators.minLength(2)]),
      colours: new FormControl(''),
      products: new FormControl(''),
      description: new FormControl('', [Validators.required, Validators.minLength(2)]),
      hsnCode: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8), isNumber]),
      hsnRate: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2), isDecimal]),
    });

    // Calculate Price when HSN Code value gets updated
    this.productDetailsForm.get('hsnRate')?.valueChanges.subscribe(rate => {

      (this.priceDetailsFormGroup.get('priceDetail') as FormArray).controls.forEach((element: any) => {

        // calculation for COD
        element.patchValue({'codGSTOnProduct': this.calculateComission.transform(element.controls['cod'].value, rate)});
        let codTotal = element.controls['cod'].value + element.get('codGSTOnProduct')?.value - element.get('codComission')?.value - element.get('codGSTOnComission')?.value
        - element.get('codTCS')?.value - element.get('codTDS')?.value;
        element.patchValue({'codFinal': codTotal});

        // Calculation for sevenDays
        element.patchValue({'sevenDaysGSTOnProduct': this.calculateComission.transform(element.controls['sevenDays'].value, rate)});
        let sevenDaysTotal = element.controls['sevenDays'].value + element.get('sevenDaysGSTOnProduct')?.value - element.get('sevenDaysComission')?.value - element.get('sevenDaysGSTOnComission')?.value
        - element.get('sevenDaysTCS')?.value - element.get('sevenDaysTDS')?.value;
        element.patchValue({'sevenDaysFinal': sevenDaysTotal});

        // Calculation for thirtyDays
        element.patchValue({'thirtyDaysGSTOnProduct': this.calculateComission.transform(element.controls['thirtyDays'].value, rate)});
        let thirtyDaysTotal = element.controls['thirtyDays'].value + element.get('thirtyDaysGSTOnProduct')?.value - element.get('thirtyDaysComission')?.value - element.get('thirtyDaysGSTOnComission')?.value
        - element.get('thirtyDaysTCS')?.value - element.get('thirtyDaysTDS')?.value;
        element.patchValue({'thirtyDaysFinal': thirtyDaysTotal});

        // // Calculation for fortyFiveDays
        // element.patchValue({'fortyFiveDaysGSTOnProduct': this.calculateComission.transform(element.controls['fortyFiveDays'].value, rate)});
        // let fortyFiveDaysTotal = element.controls['fortyFiveDays'].value + element.get('fortyFiveDaysGSTOnProduct')?.value - element.get('fortyFiveDaysComission')?.value - element.get('fortyFiveDaysGSTOnComission')?.value
        // - element.get('fortyFiveDaysTCS')?.value - element.get('fortyFiveDaysTDS')?.value;
        // element.patchValue({'fortyFiveDaysFinal': fortyFiveDaysTotal});
      });
    });
  }

  codValueChange(element: any): void{
    // Calculate COD price when updated
    const val = element.get('cod')?.value;
    element.patchValue({'codComission': this.calculateComission.transform(val, 1)});
    element.patchValue({'codGSTOnProduct': this.calculateComission.transform(val, this.productDetailsForm.get('hsnRate')?.value)});
    element.patchValue({'codGSTOnComission': this.calculateComission.transform(element.get('codComission')?.value, 18)});
    element.patchValue({'codTCS': this.calculateComission.transform(val, 1)});
    element.patchValue({'codTDS': this.calculateComission.transform(val, 1)});
    let total = val + element.get('codGSTOnProduct')?.value - element.get('codComission')?.value - element.get('codGSTOnComission')?.value
    - element.get('codTCS')?.value - element.get('codTDS')?.value;
    element.patchValue({'codFinal': total});
  }

  sevenDayValueChange(element: any): void{
    // Calculate sevenDays price when updated
    const val = element.get('sevenDays')?.value;
    element.patchValue({'sevenDaysComission': this.calculateComission.transform(val, 1)});
    element.patchValue({'sevenDaysGSTOnProduct': this.calculateComission.transform(val, this.productDetailsForm.get('hsnRate')?.value)});
    element.patchValue({'sevenDaysGSTOnComission': this.calculateComission.transform(element.get('sevenDaysComission')?.value, 18)});
    element.patchValue({'sevenDaysTCS': this.calculateComission.transform(val, 1)});
    element.patchValue({'sevenDaysTDS': this.calculateComission.transform(val, 1)});
    let total = val + element.get('sevenDaysGSTOnProduct')?.value - element.get('sevenDaysComission')?.value - element.get('sevenDaysGSTOnComission')?.value
    - element.get('sevenDaysTCS')?.value - element.get('sevenDaysTDS')?.value;
    element.patchValue({'sevenDaysFinal': total});
  }

  thirtyDayValueChange(element: any): void{
    // Calculate thirtyDays price when updated
    const val = element.get('thirtyDays')?.value;
    element.patchValue({'thirtyDaysComission': this.calculateComission.transform(val, 1)});
    element.patchValue({'thirtyDaysGSTOnProduct': this.calculateComission.transform(val, this.productDetailsForm.get('hsnRate')?.value)});
    element.patchValue({'thirtyDaysGSTOnComission': this.calculateComission.transform(element.get('thirtyDaysComission')?.value, 18)});
    element.patchValue({'thirtyDaysTCS': this.calculateComission.transform(val, 1)});
    element.patchValue({'thirtyDaysTDS': this.calculateComission.transform(val, 1)});
    let total = val + element.get('thirtyDaysGSTOnProduct')?.value - element.get('thirtyDaysComission')?.value - element.get('thirtyDaysGSTOnComission')?.value
    - element.get('thirtyDaysTCS')?.value - element.get('thirtyDaysTDS')?.value;
    element.patchValue({'thirtyDaysFinal': total});
  }

  fortyFiveDayValueChange(element: any): void{
    // Calculate fortyFiveDays price when updated
    const val = element.get('fortyFiveDays')?.value;
    element.patchValue({'fortyFiveDaysComission': this.calculateComission.transform(val, 1)});
    element.patchValue({'fortyFiveDaysGSTOnProduct': this.calculateComission.transform(val, this.productDetailsForm.get('hsnRate')?.value)});
    element.patchValue({'fortyFiveDaysGSTOnComission': this.calculateComission.transform(element.get('fortyFiveDaysComission')?.value, 18)});
    element.patchValue({'fortyFiveDaysTCS': this.calculateComission.transform(val, 1)});
    element.patchValue({'fortyFiveDaysTDS': this.calculateComission.transform(val, 1)});
    let total = val + element.get('fortyFiveDaysGSTOnProduct')?.value - element.get('fortyFiveDaysComission')?.value - element.get('fortyFiveDaysGSTOnComission')?.value
    - element.get('fortyFiveDaysTCS')?.value - element.get('fortyFiveDaysTDS')?.value;
    element.patchValue({'fortyFiveDaysFinal': total});
  }

  ngOnInit(): void {
    this.stepper = new Stepper(document.querySelector('#addProduct')  as HTMLCanvasElement, {
      linear: false,
      animation: true
    });
    this.product.getProductCategory().subscribe(response => {
      if (response && response.status && response.data && response.data.length > 0) {
        this.productCategoryList = response.data;
        this.productDetailsForm.patchValue({'productCategory': this.productCategoryList[0]._id});
        this.fetchProductQuality(this.productCategoryList[0]._id);
      } else {
        this.toast.error('Please ask admin to add Product Category', 'Product Category not found');
      }
    }, err => {
      this.toast.error(err.message, 'Fail to fetch Product Category');
    })
  }

  addPriceDetail(productType: string): void{
    const productTest = this.priceDetailsFormGroup.get('priceDetail') as FormArray
    productTest.push(this.createProductFormGroup(productType));
  }


  private createProductFormGroup(productType: string): FormGroup {

    return new FormGroup({
      'productType': new FormControl(productType),
      'cod': new FormControl('', [Validators.required, Validators.minLength(2), isDecimal]),
      'sevenDays': new FormControl('', [Validators.required, Validators.minLength(2), isDecimal]),
      'thirtyDays': new FormControl('', [Validators.required, Validators.minLength(2), isDecimal]),
      'codGSTOnProduct': new FormControl(0),
      'sevenDaysGSTOnProduct': new FormControl(0),
      'thirtyDaysGSTOnProduct': new FormControl(0),
      'codComission': new FormControl(0),
      'sevenDaysComission': new FormControl(0),
      'thirtyDaysComission': new FormControl(0),
      'codGSTOnComission': new FormControl(0),
      'sevenDaysGSTOnComission': new FormControl(0),
      'thirtyDaysGSTOnComission': new FormControl(0),
      'codTCS': new FormControl(0),
      'sevenDaysTCS': new FormControl(0),
      'thirtyDaysTCS': new FormControl(0),
      'codTDS': new FormControl(0),
      'sevenDaysTDS': new FormControl(0),
      'thirtyDaysTDS': new FormControl(0),
      'codFinal': new FormControl(0),
      'sevenDaysFinal': new FormControl(0),
      'thirtyDaysFinal': new FormControl(0),
    })
  }

  selectProductCategory(event: any): void {
    this.fetchProductQuality(event.target.value);
  }

  addColor(event: any): void {
    let isExist = false;
    if (event.target.value) {
      for (const key in this.colours) {
        if(this.colours[key].toLowerCase() === event.target.value.toLowerCase()) {
          isExist = true;
        }
      }
      isExist ? this.toast.error(`${event.target.value} colour already added to the list.`, 'Colour already added') : this.colours.push(event.target.value);
      event.target.value = '';
    }
  }

  addProducts(event: any): void {
    let isExist = false;
    if (event.target.value) {
      for (const key in this.products) {
        if(this.products[key].toLowerCase() === event.target.value.toLowerCase()) {
          isExist = true;
        }
      }
      isExist ? this.toast.error(`${event.target.value} colour already added to the list.`, 'Colour already added') : this.products.push(event.target.value);
      event.target.value = '';
    }
  }

  removeColour(colour: string): void {
    const index = this.colours.indexOf(colour);
    if (index > -1) {
      this.colours.splice(index, 1);
    } else {
      this.toast.error(`${colour} colour not found in the list.`, 'Colour not found')
    }
  }

  removeProducts(productTypes: string): void {
    this.removePriceDetails.push(productTypes);
    const index = this.products.indexOf(productTypes);
    if (index > -1) {
      this.products.splice(index, 1);
    } else {
      this.toast.error(`${productTypes} Product type not found in the list.`, 'Colour not found')
    }
  }


  selectProductQuality(selectedQualityId: string): void {
    let selectedQuality = this.productQualityList.find(quality => quality._id === selectedQualityId)
    if (selectedQuality && selectedQuality.name === 'OTHER') {
      this.customQuality = true;
      this.productDetailsForm.addControl('customQuality', new FormControl('', Validators.required));
    } else {
      this.customQuality = false;
      this.productDetailsForm.removeControl('customQuality');
    }
  }

  fetchProductQuality(productCategoryId: string): void {
    this.product.getProductNameByCategory(productCategoryId).subscribe(response => {
      if (response && response.status && response.data && response.data.length > 0) {
        this.productQualityList = response.data;
        this.productDetailsForm.patchValue({'productName': this.productQualityList[0]._id});
      } else {
        this.toast.error('Please ask admin to add Product Quality', 'Product Quality not found');
      }
    }, err => {
      this.toast.error(err.message, 'Fail to fetch Product Quality');
    });
  }

  showQualityList(): void {
    this.customQuality = false;
    this.productDetailsForm.removeControl('customQuality');
    this.productDetailsForm.patchValue({'productName': this.productQualityList[0]._id});
  }

  addProduct(): void {
    this.productDetailsForm.markAllAsTouched();
    if (this.productDetailsForm.valid && this.colours.length > 0 && this.products.length > 0) {
      this.stepper.to(2);
      // this.priceDetailsFormGroup = new FormGroup({
      //   priceDetail: new FormArray([])
      // });


      // this.products.forEach(res => {
      //   this.addPriceDetail(res);
      // });

      const priceDetails = this.priceDetailsFormGroup.getRawValue();
      this.products.forEach(res => {
        let is_existing = false;
        priceDetails.priceDetail.forEach((element: any) => {
          if (res === element.productType) {
            is_existing = true;
          }
        });

        if (!is_existing){
          this.addPriceDetail(res);
        }
      });


      const removePrice: any = [];
      priceDetails.priceDetail.forEach((element: any, i: any) => {
        let is_existing = true;
        this.removePriceDetails.forEach((res: any) => {
          if (res === element.productType) {
            is_existing = false;
          }
        });
        if (!is_existing){
          removePrice.push(i);
        }
      });
      removePrice.forEach((element: any) => {
        (this.priceDetailsFormGroup.get('priceDetail') as FormArray).removeAt(element);
      });


    } else {
      this.stepper.to(1);
      this.toast.error('Please complete this step first');
    }
  }

  addPrice(): void {
    if (this.priceDetailsFormGroup.valid) {
      this.stepper.to(3);
    } else {
      this.addProduct();
      this.toast.error('Please complete this step first', 'Navigation Blocked');
    }
  }

  onFileDropped(event: any, id: string): void {
    const file = event.dataTransfer.files[0];
    this.handleFile(file, id);
  }

  fileBrowseHandler(event: any, id: string): void {
    if (event.target.files.length >= 7 ){
      this.toast.error('Please select maximum 6 Files.');
    }else{

      // this.productImages = [];
      for (var i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].type.includes('image') && !event.target.files[i].type.includes('tiff')) {
          var reader = new FileReader();
          reader.onload = (event: any) => { // called once readAsDataURL is completed
            this.productImages.push(event.target.result);
          }
          this.productImagesFile.push(event.target.files[i]);
          reader.readAsDataURL(event.target.files[i]); // read file as data url
        }else{
          this.toast.error('only image file allow.');
        }
      }
    }
  }

  handleFile(event: any, id = ''): void {
    for (var i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].type.includes('image') && !event.target.files[i].type.includes('tiff')) {
        var reader = new FileReader();
        reader.onload = (event: any) => { // called once readAsDataURL is completed
          this.productImages.push(event.target.result);
        }
        this.productImagesFile.push(event.target.files[i]);
        reader.readAsDataURL(event.target.files[i]); // read file as data url
      }else{
        this.toast.error('only image file allow.');
      }
    }
  }

  removeProductImage(index: number): void {
    this.productImages.splice(index, 1);
    this.productImagesFile.splice(index, 1);
  }

  uploadImages(): void {
    const productDetail = this.productDetailsForm.getRawValue();
    const priceDetails = this.priceDetailsFormGroup.getRawValue();
    const data: any = {
      "payload": {
        "productDetails": {
          "productQuality": productDetail.productQuality,
          "productCategory": productDetail.productCategory,
          "productName": productDetail.productName,
          "description": productDetail.description,
          "hsnCode": productDetail.hsnCode,
          "hsnRate": productDetail.hsnRate,
          "colours": this.colours,
          "productType": this.products
        }
      }
    };

    const tempPriceDetail: any = [];
    priceDetails.priceDetail.forEach((element: any) => {
      const dataTemp: any = {
        "productType": element.productType,
        "cod": element.cod,
        "codTCS": element.codTCS,
        "codTDS": element.codTDS,
        "codFinal": element.codFinal,
        "codComission": element.codComission,
        "codGSTOnProduct": element.codGSTOnProduct,
        "codGSTOnComission": element.codGSTOnComission,

        "sevenDays": element.sevenDays,
        "sevenDaysTCS": element.sevenDaysTCS,
        "sevenDaysTDS": element.sevenDaysTDS,
        "sevenDaysFinal": element.sevenDaysFinal,
        "sevenDaysComission": element.sevenDaysComission,
        "sevenDaysGSTOnProduct": element.sevenDaysGSTOnProduct,
        "sevenDaysGSTOnComission": element.sevenDaysGSTOnComission,

        "thirtyDays": element.thirtyDays,
        "thirtyDaysTCS": element.thirtyDaysTCS,
        "thirtyDaysTDS": element.thirtyDaysTDS,
        "thirtyDaysFinal": element.thirtyDaysFinal,
        "thirtyDaysComission": element.thirtyDaysComission,
        "thirtyDaysGSTOnProduct": element.thirtyDaysGSTOnProduct,
        "thirtyDaysGSTOnComission": element.thirtyDaysGSTOnComission,
      };
      tempPriceDetail.push(dataTemp);
    });
    data['payload']['priceDetails'] = tempPriceDetail;
    data['productImage'] = this.productImagesFile;
    if (this.productDetailsForm.valid && this.priceDetailsFormGroup.valid){
      const formData = new FormData();
      Globals.convertJSONToFormData(formData, data);

      this.product.addSingleProduct(formData).subscribe( res => {
        this.router.navigate(['/seller/products']);
      });
    }else{
      this.toast.error('Please enter valid product details');
    }
  }

  displayProductImage(imageSrc: any): void {
    const modalRef = this.modalService.open(ProductImageComponent, {backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, keyboard: false });
    modalRef.componentInstance.imageSrc = imageSrc;
  }

}
