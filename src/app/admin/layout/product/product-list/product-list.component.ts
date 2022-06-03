import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, merge, Observable, of, Subscription } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { IProdut, ProductService } from 'src/app/services/admin/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  isApiCalling: boolean = false;

  desktopDisplayedColumns = ['productImage', 'productName', 'productCategory', 'description', 'hsnCode', 'availableStock', 'action'];
  mobileDisplayedColumns = ['productImage', 'details', 'action'];

  productData: IProdut[] = [];

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  productSearchFC: FormControl;

  subs: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,
    public breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {

    this.subs = new Subscription();

    this.productSearchFC = new FormControl();

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})));

    this.isApiCalling = true;

    // const searchSub = this.productSearchFC.valueChanges.pipe(
    //   tap(() => {
    //     this.isApiCalling = true;
    //     this.productData = [];
    //   }),
    //   debounceTime(300),
    //   switchMap(() => {

    //     let params: HttpParams = new HttpParams();

    //     if (!!this.productSearchFC.value && this.productSearchFC.value.trim() !== '') {
    //       params = params.set('search', this.productSearchFC.value);
    //     }

    //     return this.productService.getProduct(params);
    //   })
    // ).subscribe({
    //   next: (v) => {
    //     if (v.status) {
    //       this.productData = v.data;
    //     } else {
    //       this.toastrService.error(v.message);
    //     }
    //     this.isApiCalling = false;
    //     this.cd.markForCheck();
    //   },
    //   error: (v) => {
    //     this.toastrService.error(v.message);
    //     this.isApiCalling = false;
    //     this.cd.markForCheck();
    //   }
    // });

    // this.subs.add(searchSub);

    // const subs = this.productService.getProduct(new HttpParams()).subscribe({
    //   next: (v) => {
    //     if (v.status) {
    //       this.productData = v.data;
    //     } else {
    //       this.toastrService.error(v.message);
    //     }
    //     this.isApiCalling = false;
    //     this.cd.markForCheck();
    //   },
    //   error: (v) => {
    //     this.toastrService.error(v.message);
    //     this.isApiCalling = false;
    //     this.cd.markForCheck();
    //   }
    // });

    // this.subs.add(subs);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
    const subs = combineLatest([
      this.paginator.page.pipe(startWith({})),
      this.productSearchFC.valueChanges.pipe(startWith(this.productSearchFC.value))
    ]).pipe(
      tap(() => {
        this.isApiCalling = true;
        this.productData = [];
      }),
      debounceTime(300),
      switchMap(() => {

        let params: HttpParams = new HttpParams();

        if (!!this.productSearchFC.value && this.productSearchFC.value.trim() !== '') {
          params = params.set('search', this.productSearchFC.value);

          this.paginator.pageIndex = 0;
        }

        params = params.set('page', String(this.paginator.pageIndex + 1)).set('limit', String(this.paginator.pageSize));

        return this.productService.getProduct(params);
      })
    ).subscribe({
      next: (v) => {
        if (v.status) {
          this.productData = v.data;
          this.paginator.length = v.total;
        } else {
          this.toastrService.error(v.message);
          this.paginator.length = 0;
        }
        this.isApiCalling = false;
        this.cd.markForCheck();
      },
      error: (v) => {
        this.toastrService.error(v.message);
        this.isApiCalling = false;
        this.paginator.length = 0;
        this.cd.markForCheck();
      }
    });

    this.subs.add(subs);
  }

  ngOnDestroy(): void {
    
    this.subs.unsubscribe();
  }

  approvedProduct(id: string, isApproved: boolean): void {
    const subs = this.productService.approveProduct(id, {approved: isApproved}).pipe(
      switchMap(v => {
        if (v.status) {

          this.toastrService.success(v.message);

          this.isApiCalling = true;
          this.productData = [];

          // const params: HttpParams = new HttpParams().set('role', this.userOptionFC.value);

          return this.productService.getProduct(new HttpParams());
        } else {

          this.toastrService.error(v.message);

          return of(null);
        }
      })
    ).subscribe({
      next: (v) => {
        if (v?.status) {
          this.productData = v.data;
        } else {
          this.toastrService.error(v?.message);
        }
        this.isApiCalling = false;
        this.cd.markForCheck();
      },
      error: (v) => {
        this.toastrService.error(v.message);
        this.isApiCalling = false;
        this.cd.markForCheck();
      }
    });

    this.subs.add(subs);
  }
}
