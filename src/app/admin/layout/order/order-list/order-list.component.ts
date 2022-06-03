import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { IOrder, OrderService } from 'src/app/services/admin/order.service';
import { ToastrService } from 'ngx-toastr';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit, AfterViewInit, OnDestroy {

  isApiCalling: boolean = false;

  desktopDisplayedColumns = ['productName', 'orderBy', 'orderTo', 'payment', 'quantity', 'approved', 'status', 'action'];
  mobileDisplayedColumns = ['details', 'status', 'action'];

  orderData: IOrder[] = [];

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  orderSearchFC: FormControl;

  subs: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private orderService: OrderService,
    private toastrService: ToastrService,
    public breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {

    this.orderSearchFC = new FormControl();

    this.isApiCalling = true;

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})));

    this.subs = new Subscription();

    // this.orderSearchFC.valueChanges.pipe(
    //   tap(() => {
    //     this.isApiCalling = true;
    //     this.orderData = [];
    //   }),
    //   debounceTime(300),
    //   switchMap(() => {

    //     let params: HttpParams = new HttpParams();

    //     if (!!this.orderSearchFC.value && this.orderSearchFC.value.trim() !== '') {
    //       params = params.set('search', this.orderSearchFC.value);
    //     }

    //     return this.orderService.getOrder(params);
    //   })
    // ).subscribe({
    //   next: (v) => {
    //     if (v.status) {
    //       this.orderData = v.data;
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

    // const subs = this.orderService.getOrder().subscribe({
    //   next: (v: any) => {
    //     if (v.status) {
    //       this.orderData = v.data;
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
      this.orderSearchFC.valueChanges.pipe(startWith(this.orderSearchFC.value))
    ]).pipe(
      tap(() => {
        this.isApiCalling = true;
        this.orderData = [];
      }),
      debounceTime(300),
      switchMap(() => {

        let params: HttpParams = new HttpParams();

        if (!!this.orderSearchFC.value && this.orderSearchFC.value.trim() !== '') {
          params = params.set('search', this.orderSearchFC.value);

          this.paginator.pageIndex = 0;
        }

        params = params.set('page', String(this.paginator.pageIndex + 1)).set('limit', String(this.paginator.pageSize));

        return this.orderService.getOrder(params);
      })
    ).subscribe({
      next: (v) => {
        if (v.status) {
          this.orderData = v.data;
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
}
