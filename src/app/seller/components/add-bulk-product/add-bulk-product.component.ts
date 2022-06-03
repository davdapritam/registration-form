import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../services/products/product.service';
import { AbstractControl, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { isDecimal, isNumber } from 'src/app/shared/validators/customValidation';
import { errorHandler } from 'src/app/shared/validators/errorHandler';

@Component({
  selector: 'app-add-bulk-product',
  templateUrl: './add-bulk-product.component.html',
  styleUrls: ['./add-bulk-product.component.css']
})
export class AddBulkProductComponent implements OnInit {

  products: FormGroup;
  productCategoryList: Array<{_id: string, name: string}> = [];
  productQualityList: Array<{_id: string, name: string, category: string}> = [];
  errorHandler = errorHandler;

  get getProduct(): AbstractControl[]{
    return (this.products.get('product') as FormArray).controls as AbstractControl[];
  }

  constructor(private productService: ProductService,private toast: ToastrService) {
    this.products = new FormGroup({
      product_category: new FormControl('', Validators.required),
      product: new FormArray([this.createProductFormGroup()])
    });
  }

  ngOnInit(): void {
    this.productService.getProductCategory().subscribe(response => {
      if (response && response.status && response.data && response.data.length > 0) {
        this.productCategoryList = response.data;
        this.products.patchValue({'product_category': this.productCategoryList[0]._id});
        this.fetchProductQuality(this.productCategoryList[0]._id);
      } else {
        this.toast.error('Please ask admin to add Product Category', 'Product Category not found');
      }
    }, err => {
      this.toast.error(err.message, 'Fail to fetch Product Category');
    });
  }

  selectProductCategory(event: any): void {
    this.fetchProductQuality(event.target.value);
  }

  /**
   * Fetch Product quality or type
   * @param productCategoryId
   */
  fetchProductQuality(productCategoryId: string): void {
    this.productService.getProductNameByCategory(productCategoryId).subscribe(response => {
      if (response && response.status && response.data && response.data.length > 0) {
        this.productQualityList = response.data;
        (this.products.get('product') as FormArray).controls.forEach(element => {
          element.get('product_quality')?.setValue(this.productQualityList[0]._id);
        });
        this.products
      } else {
        this.toast.error('Please ask admin to add Product Quality', 'Product Quality not found');
      }
    }, err => {
      this.toast.error(err.message, 'Fail to fetch Product Quality');
    });
  }


  addNewProduct(): void{
    const product = this.products.get('product') as FormArray
    product.push(this.createProductFormGroup())
  }

  private createProductFormGroup(): FormGroup {
    return new FormGroup({
      'product_type': new FormControl('', [Validators.required]),
      'product_quality': new FormControl(this.productQualityList.length >= 1 ? this.productQualityList[0]._id : ''),
      'manager_name': new FormControl('', [Validators.required]),
      'product_desc': new FormControl('', [Validators.required]),
      'product_color': new FormControl('', [Validators.required]),
      'product_hsn': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8), isNumber]),
      'product_gst': new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2), isDecimal]),
      'product_stock': new FormControl('', [Validators.required]),
      'product_cod': new FormControl('', [Validators.required]),
      'product_7day': new FormControl('', [Validators.required]),
      'product_30day': new FormControl('', [Validators.required]),
      'product_45day': new FormControl('', [Validators.required])
    })
  }

  public addProductFormGroup() {
    const product = this.products.get('product') as FormArray
    product.push(this.createProductFormGroup());
  }

  public removeOrClearProduct(i: number) {
    const emails = this.products.get('product') as FormArray;
    if (emails.length > 1) {
      emails.removeAt(i);
    } else {
      emails.reset();
    }
  }

  /**
   * Submit product detail
   */
  submitProduct(): void{
    if (this.products.valid) {
      console.log('Submit true::::::::::::::', this.products);
    }else{
      this.products.markAllAsTouched();
      console.log('Submit false::::::::::::::', this.products);
    }
  }

  /**
   * Manage Dynamic fom control
   * @param controlName Pass control name
   * @param errorName Pass error name
   * @param notError ignore error name
   * @returns
   */
  mainStreamFormError(controlName: string, errorName: string, notError: Array<string> = new Array()): any {
    const otherError: any = this.products.controls[controlName].errors;
    return (otherError ? !Object.keys(otherError).some(err => notError.includes(err)) : true) ? this.products.controls[controlName].hasError(errorName) : false;
  }

  /**
   * Check form control valid or not
   *
   * @param formControlData Pass form control data
   * @param control_name Pass Control name
   * @returns
   */
  checkValidation(formControlData: any, control_name: string): boolean{
    // formControlData.controls[control_name].touched
    if (formControlData.controls[control_name].touched) {
      return formControlData.controls[control_name].invalid;
    }else{
      return false;
    }
  }


  formControlErrorReturn(formControlData: any, control_name: string): string{
    // formControlData.controls[control_name].touched
    return formControlData.controls[control_name].errors;
    // if (formControlData.controls[control_name].touched) {
    // }else{
    //   return false;
    // }
  }
}
