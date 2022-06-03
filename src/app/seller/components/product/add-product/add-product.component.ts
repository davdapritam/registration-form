import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BreakpointsService } from 'src/app/services/breakpoints.service';
import { WebRequestService } from 'src/app/web-request.service';
 

export interface IProduct {
  productCategory: string;
  mainProductName: string;
  hsnCode: string;
  hsnRate: number;
  gst: number;
  description: string;
  subProducts: ISubProduct[];
}

export interface ISubProduct {
  name: string;
  sizes: ISubProductUnit[];
}

export interface ISubProductUnit {
  name: string;
  sizeDescription: ISubProductAdditionalInfo[];
}

export interface ISubProductAdditionalInfo {
  lusterName: string;
  colours: string;
  availableQty: Number;
  cod:number;
  codTCS:number;
  codTDS:number;
  codFinal: number;
  codComission: number;
  codGSTOnProduct:number;
  codGSTOnComission:number;
  sevenDays:number;
  sevenDaysTCS:number;
  sevenDaysTDS:number;
  sevenDaysComission:number;
  sevenDaysFinal: number;
  sevenDaysGSTOnProduct: number;
  sevenDaysGSTOnComission:number;
  thirtyDays:number;
  thirtyDaysTCS:number;
  thirtyDaysTDS:number;
  thirtyDaysFinal: number;
  thirtyDaysComission:number;
  thirtyDaysGSTOnProduct: number;
  thirtyDaysGSTOnComission:number;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent implements OnInit {

  // @ViewChild('subProductAdditionalFATable') subProductAdditionalFATable!: MatTable<AbstractControl>;
  // @ViewChild('subProductUnitFATable') subProductUnitFATable!: MatTable<AbstractControl>;
  @ViewChild('subProductFATable') subProductFATable!: MatTable<AbstractControl>;

  productFG!:FormGroup;

  ProductDetail !: FormGroup;

  desktopDisplayedColumns = ['sub_product', 'sizes'];
  
  desktopSubProductColumns = ['name_name', 'sub_product_detail'];

  desktopSubProductAdditionalDisplayedColumns = ['lusterName', 'colours', 'availableQty', 'codFinal_price', 'sevenDaysFinal_price', 'thirtyDaysFinal_price'];

  isMobile$: Observable<{mobile: boolean}>;

  show_unit:boolean=false;
  show_subAdditional:boolean=false;

  get subProductFA(): FormArray {
    return this.productFG.get('subProducts') as FormArray;
  }

  get subProductUnitFA(): FormArray {
    return this.productFG?.get('subProducts')?.get('0')?.get('sizes') as FormArray;
  }


  constructor(
    private breakpointsService: BreakpointsService,
    private cd: ChangeDetectorRef,
    private webRequestService: WebRequestService,
    private router: Router
  ) {

    this.productFG = this.createProductFG();

    this.isMobile$ = this.breakpointsService.getMobileBreakPointObs$();
  }

  ngOnInit(): void {

    console.log(':::: productFG', this.productFG);
  }

  /**
   * create main product formgroup and return formgroup
  */
  createProductFG(d?: IProduct): FormGroup {

    const fg: FormGroup = new FormGroup({
      productCategory: new FormControl(d?.productCategory || ''),
      mainProductName: new FormControl(d?.mainProductName || ''),
      hsnCode: new FormControl(d?.hsnCode || ''),
      hsnRate: new FormControl(d?.hsnRate || ''),
      gst: new FormControl(d?.gst || ''),
      description: new FormControl(d?.description || ''),
      subProducts: new FormArray([])
    });

    (d?.subProducts || Array.from({length: 1}))?.forEach(v => (fg.get('subProducts') as FormArray).push(this.createSubProductFG(v || null)))

    return fg;
  }

  /**
   * create sub product formgroup and return formgroup
  */
  createSubProductFG(d: ISubProduct | null): FormGroup {

    const fg: FormGroup = new FormGroup({
      name: new FormControl(d?.name || ''),
      sizes: new FormArray([])
    });

    (d?.sizes || Array.from({length: 1})).forEach(v => (fg.get('sizes') as FormArray).push(this.createSubProductUnitFG(v)));

    return fg;
  }

  createSubProductUnitFG(d: ISubProductUnit | null): FormGroup {

    const fg: FormGroup = new FormGroup({
      name: new FormControl(d?.name || ''),
      sizeDescription: new FormArray([])
    });

    (d?.sizeDescription || Array.from({length: 1})).forEach(v => (fg.get('sizeDescription') as FormArray).push(this.createSubProductAdditionalInfoFG(v)));

    return fg;
  }

  /**
   * create sub product additional info formgroup and return formgroup
  */
  createSubProductAdditionalInfoFG(d: ISubProductAdditionalInfo | null): FormGroup {
    
    const fg: FormGroup = new FormGroup({
      lusterName: new FormControl(d?.lusterName || ''),
      colours: new FormControl(d?.colours || ''),
      availableQty: new FormControl(d?.availableQty || ''),
      cod: new FormControl(100),
      codTCS: new FormControl(100),
      codTDS: new FormControl(100),
      codFinal: new FormControl(d?.codFinal || ''),
      codComission: new FormControl(d?.codComission || ''),
      codGSTOnProduct: new FormControl(1),
      codGSTOnComission: new FormControl(1),
      sevenDays: new FormControl(1),
      sevenDaysTCS: new FormControl(1),
      sevenDaysTDS: new FormControl(1),
      sevenDaysComission: new FormControl(1),
      sevenDaysGSTOnComission: new FormControl(1),
      sevenDaysFinal: new FormControl(d?.sevenDaysFinal || ''),
      sevenDaysGSTOnProduct: new FormControl(d?.sevenDaysGSTOnProduct || ''),
      thirtyDays: new FormControl(30),
      thirtyDaysTCS: new FormControl(32),
      thirtyDaysTDS: new FormControl(30),
      thirtyDaysComission: new FormControl(1),
      thirtyDaysGSTOnComission: new FormControl(1),
      thirtyDaysFinal: new FormControl(d?.thirtyDaysFinal || ''),
      thirtyDaysGSTOnProduct: new FormControl(d?.thirtyDaysGSTOnProduct || ''),
    });

    return fg;
  }


  addSubProductFG(t: MatTable<AbstractControl>): void {

    this.subProductFA.push(this.createSubProductFG(null));
    t?.renderRows();
  }

  addSubProductUnitFG(fg: FormArray, t?: MatTable<AbstractControl>): void {
    
    console.log('::: fg', fg);

    (fg.get('sizes') as FormArray)?.push(this.createSubProductUnitFG(null));

    t?.renderRows();

  }

  addSubProductAdditionalInfo(fg: FormArray, t?: MatTable<AbstractControl>): void {
   
    (fg as FormArray)?.push(this.createSubProductAdditionalInfoFG(null));
   
    t?.renderRows();
  }

  

  removeSubProductFG(t: MatTable<AbstractControl>, index: number): void {

    this.subProductFA.removeAt(index);

    console.log('this.subProductFA', this.subProductFA);

    t.renderRows();
  }

  removeSubProductUnits(fg: FormGroup, index: number, t?: MatTable<AbstractControl>): void {

    console.log("index", index);

    console.log("formGroup", fg);

    (fg.get('sizes') as FormArray).removeAt(index);

    t?.renderRows();

  }

  removeSubProductAdditionalInfo(fg: FormGroup, index: number, t?: MatTable<AbstractControl>): void {

    (fg.get('sizeDescription')as FormArray).removeAt(index);

    t?.renderRows();
  }

  dataD(f: FormGroup) {
    console.log('::: f', f);
  }

  show_SubUnit(){
    this.show_unit= true;
  }

  show_SubAdditionalInfo(){
    this.show_subAdditional= true;
  }

  InsertData(data: any){

    console.log("Product Data", data);
    

    data?.subProducts.map((subProduct:any)=>{
     console.log("subProduct",subProduct);
     subProduct.sizes.map((size:any)=>{
       console.log("size",size);
       size.sizeDescription.map((sizeDesc:any)=>{
         console.log("sizeDesc",sizeDesc);
         sizeDesc.colours = sizeDesc.colours.toString().split(",")
         
       })
     })
      
    })
    
    console.log("Product",data);
    
    return this.webRequestService.sendProduct(this.productFG.value).subscribe((obj: any) => {
      console.log("Response", obj);
      console.log("Object Id", obj.data.productRecord)
    });
  }

  saveAndNext(data: any){

    console.log("Product Data", data);
    

    data?.subProducts.map((subProduct:any)=>{
     console.log("subProduct",subProduct);
     subProduct.sizes.map((size:any)=>{
       console.log("size",size);
       size.sizeDescription.map((sizeDesc:any)=>{
         console.log("sizeDesc",sizeDesc);
         sizeDesc.colours = sizeDesc.colours.toString().split(",")
         
       })
     })
      
    })
    
    console.log("Product",data);
    
    return this.webRequestService.sendProduct(this.productFG.value).subscribe((obj: any) => {
      console.log("Response", obj);
      this.router.navigate(['login']);

    });

  }

}
