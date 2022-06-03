import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/admin/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  priceFG: FormGroup;

  subs: Subscription;

  isApiCalling: boolean = false;

  get pricesFA() {
    return (<FormArray>this.priceFG.get('prices')).controls as FormGroup[];
    // return this.priceFG.get('prices') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {

    this.subs = new Subscription();

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})), shareReplay(1));

    this.priceFG = new FormGroup({
      prices: new FormArray([])
    });

    const subs = this.route.paramMap.pipe(
      switchMap(v => this.productService.getSingleProduct(v.get('id') as string))
    ).subscribe(v => {
      const priceFA = this.priceFG.get('prices') as FormArray;
      v.data.productPrice.forEach(v => {
        priceFA.push(this.createPriceFG(v));
      });
      this.cd.detectChanges();
    });

    this.subs.add(subs);
  }

  ngOnInit(): void {
  }

  createPriceFG(d: {
    cod: number;
    codComission: number;
    codFinal: number;
    codGSTOnComission: number;
    codGSTOnProduct: number;
    codTCS: number;
    codTDS: number;
    product: string;
    sevenDays: number;
    sevenDaysComission: number;
    sevenDaysFinal: number;
    sevenDaysGSTOnComission: number;
    sevenDaysGSTOnProduct: number;
    sevenDaysTCS: number;
    sevenDaysTDS: number;
    thirtyDays: number;
    thirtyDaysComission: number;
    thirtyDaysFinal: number;
    thirtyDaysGSTOnComission: number;
    thirtyDaysGSTOnProduct: number;
    thirtyDaysTCS: number;
    thirtyDaysTDS: number;
    _id: string;
  } | null): FormGroup {

    return new FormGroup({
      cod: new FormControl(d?.cod || 0),
      codComission: new FormControl(d?.codComission || 0),
      codFinal: new FormControl(d?.codFinal || 0),
      codGSTOnComission: new FormControl(d?.codGSTOnComission || 0),
      codGSTOnProduct: new FormControl(d?.codGSTOnProduct || 0),
      codTCS: new FormControl(d?.codTCS || 0),
      codTDS: new FormControl(d?.codTDS || 0),
      // product: new FormControl(d?.product || 0),
      sevenDays: new FormControl(d?.sevenDays || 0),
      sevenDaysComission: new FormControl(d?.sevenDaysComission || 0),
      sevenDaysFinal: new FormControl(d?.sevenDaysFinal || 0),
      sevenDaysGSTOnComission: new FormControl(d?.sevenDaysGSTOnComission || 0),
      sevenDaysGSTOnProduct: new FormControl(d?.sevenDaysGSTOnProduct || 0),
      sevenDaysTCS: new FormControl(d?.sevenDaysTCS || 0),
      sevenDaysTDS: new FormControl(d?.sevenDaysTDS || 0),
      thirtyDays: new FormControl(d?.thirtyDays || 0),
      thirtyDaysComission: new FormControl(d?.thirtyDaysComission || 0),
      thirtyDaysFinal: new FormControl(d?.thirtyDaysFinal || 0),
      thirtyDaysGSTOnComission: new FormControl(d?.thirtyDaysGSTOnComission || 0),
      thirtyDaysGSTOnProduct: new FormControl(d?.thirtyDaysGSTOnProduct || 0),
      thirtyDaysTCS: new FormControl(d?.thirtyDaysTCS || 0),
      thirtyDaysTDS: new FormControl(d?.thirtyDaysTDS || 0),
      _id: new FormControl(d?._id || this.route.snapshot.paramMap.get('id')),
    });
  }

  // addNewGroup() {

  //   // this.pricesFA.push(this.createPriceFG(null));
  //   (this.priceFG.get('prices') as FormArray).push(this.createPriceFG(null));

  //   this.cd.detectChanges();
  // }

  removePriceFG(i: number) {

    (this.priceFG.get('prices') as FormArray).removeAt(i);

    this.cd.detectChanges();
  }

  update() {

    console.log(':: ff', (this.priceFG.get('prices') as FormArray).value);

    this.productService.updateProductPrice(this.route.snapshot.paramMap.get('id') as string, (this.priceFG.get('prices') as FormArray).value).subscribe();
  }
}
