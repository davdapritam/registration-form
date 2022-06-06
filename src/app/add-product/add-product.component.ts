import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';


export interface IProduct {
  product_category: string;
  product_name: string;
  hsn_code: number;
  gst: number;
  sub_products: ISubProduct[];
}

export interface ISubProduct {
  sub_product_name: string;
  sub_product_units: ISubProductUnit[];
}

export interface ISubProductUnit {
  sub_product_unit: string;
  sub_product_additional_info: ISubProductAdditionalInfo[];
}

export interface ISubProductAdditionalInfo {
  luster: string;
  color: string;
  available_stock: string;
  cod: number;
  cod_discount_qt: number;
  cod_discount_price: number;
  seven_day: number;
  seven_day_discount_qt: number;
  seven_day_discount_price: number;
  fifteen_day: number;
  fifteen_day_discount_qt: number;
  fifteen_day_discount_price: number;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent implements OnInit {
  
  @ViewChild('subProductAdditionalFATable') subProductAdditionalFATable!: MatTable<AbstractControl>;
  @ViewChild('subProductUnitFATable') subProductUnitFATable!: MatTable<AbstractControl>;
  @ViewChild('subProductFATable') subProductFATable!: MatTable<AbstractControl>;
  
  productFG!: FormGroup;
  desktopDisplayedColumns = ['sub_product', 'sub_product_units'];
  desktopSubProductColumns = ['sub_product_unit_name', 'sub_product_detail'];
  desktopSubProductAdditionalDisplayedColumns = ['luster', 'color', 'available_stock', 'cod', 'cod_discount_qt_price', 'seven_day', 'seven_day_discount_qt_price', 'fifteen_day', 'fifteen_day_discount_qt_price', 'action'];

  
  get subProductFA(): FormArray {
    
    // console.log(":::ProductFG", this.productFG.get('sub_products'));
    
    return this.productFG.get('sub_products') as FormArray;
  }
  
  
  constructor() {
    this.productFG = this.createProductFG();
   }

  ngOnInit(): void {
    
    
    
  }
  
  // Main Product formgroup and return form group
  createProductFG(d?: IProduct): FormGroup {
    const fg: FormGroup = new FormGroup({
      product_category: new FormControl(d?.product_category || ''),
      product_name: new FormControl(d?.product_name || ''),
      hsn_code: new FormControl(d?.hsn_code || ''),
      gst: new FormControl(d?.gst || ''),
      sub_products: new FormArray([])
    });

    (d?.sub_products || Array.from({length: 1}))?.forEach(v => (fg.get('sub_products') as FormArray).push(this.createSubProductFG(v || null)))

    return fg;
  }
  
  createSubProductFG(d: ISubProduct | null): FormGroup {

    const fg: FormGroup = new FormGroup({
      sub_product_name: new FormControl(d?.sub_product_name || ''),
      // sub_product_unit: new FormControl(d?.sub_product_units || null),
      sub_product_units: new FormArray([])
    });

    (d?.sub_product_units || Array.from({length: 1})).forEach(v => (fg.get('sub_product_units') as FormArray).push(this.createSubProductUnitFG(v)));

    return fg;
  }

  createSubProductUnitFG(d: ISubProductUnit | null): FormGroup {

    const fg: FormGroup = new FormGroup({
      sub_product_unit: new FormControl(d?.sub_product_unit || ''),
      sub_product_additional_info: new FormArray([])
    });

    (d?.sub_product_additional_info || Array.from({length: 1})).forEach(v => (fg.get('sub_product_additional_info') as FormArray).push(this.createSubProductAdditionalInfoFG(v)));

    return fg;
  }

  /**
   * create sub product additional info formgroup and return formgroup
  */
  createSubProductAdditionalInfoFG(d: ISubProductAdditionalInfo | null): FormGroup {

    const fg: FormGroup = new FormGroup({
      luster: new FormControl(d?.luster || ''),
      color: new FormControl(d?.color || ''),
      available_stock: new FormControl(d?.available_stock || ''),
      cod: new FormControl(d?.cod || ''),
      cod_discount_qt: new FormControl(d?.cod_discount_qt || ''),
      cod_discount_price: new FormControl(d?.cod_discount_price || ''),
      seven_day: new FormControl(d?.seven_day || ''),
      seven_day_discount_qt: new FormControl(d?.seven_day_discount_qt || ''),
      seven_day_discount_price: new FormControl(d?.seven_day_discount_price || ''),
      fifteen_day: new FormControl(d?.fifteen_day || ''),
      fifteen_day_discount_qt: new FormControl(d?.fifteen_day_discount_qt || ''),
      fifteen_day_discount_price: new FormControl(d?.fifteen_day_discount_price || ''),
    });

    return fg;
  }
  
  dataD(f: FormGroup) {
    console.log('::: f', f);
  }
  

}
