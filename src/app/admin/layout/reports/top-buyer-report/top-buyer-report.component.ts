import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ReportService } from 'src/app/services/admin/report.service';

@Component({
  selector: 'app-top-buyer-report',
  templateUrl: './top-buyer-report.component.html',
  styleUrls: ['./top-buyer-report.component.scss']
})
export class TopBuyerReportComponent implements AfterViewInit {

  @Input()applyPadding: boolean = true;

  isApiCalling: boolean = false;

  desktopDisplayedColumns = ['name', 'email', 'mobile', 'credit_limit'];
  mobileDisplayedColumns = ['details'];

  topBuyerData: any = [];

  dateRangeFG: FormGroup;

  subs: Subscription;

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private reportService: ReportService,
    private toastrService: ToastrService,
    public breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {

    this.subs = new Subscription();

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})));

    this.isApiCalling = true;

    const date = new Date();

    this.dateRangeFG = new FormGroup({
      start_date: new FormControl(new Date(date.getTime() - date.getTimezoneOffset() * 6000).toISOString().split('T')[0], [Validators.required]),
      end_date: new FormControl(new Date(date.getTime() - date.getTimezoneOffset() * 6000).toISOString().split('T')[0], [Validators.required])
    });
  }

  ngAfterViewInit(): void {

    const subs = merge(
      this.dateRangeFG.statusChanges.pipe(
        startWith('VALID'),
        debounceTime(300),
        filter(v => v === 'VALID'),
      ),
      this.paginator.page.pipe(startWith({}))
    ).pipe(
      tap(() => {
        this.isApiCalling = true;
        this.topBuyerData = [];
      }),
      debounceTime(300),
      switchMap(() => {
        let params: HttpParams = new HttpParams();

        const startDate = new Date(this.dateRangeFG.get('start_date')?.value).toISOString().split('T')[0];
        const endDate = new Date(this.dateRangeFG.get('end_date')?.value).toISOString().split('T')[0];

        params = params.set('starting_date', startDate).set('ending_date', endDate).set( 'page', String(this.paginator.pageIndex + 1)).set('limit', String(this.paginator.pageSize));

        return this.reportService.getTopTenBuyer(params);
      })
    ).subscribe({
      next: (v: any) => {
        if (v.status) {
          this.topBuyerData = v.data;
          this.paginator.length = v.total;
        } else {
          this.toastrService.error(v.message);
          this.paginator.length = 0;
        }
        this.isApiCalling = false;
        this.cd.detectChanges();
      },
      error: (v) => {
        this.toastrService.error(v.message);
        this.isApiCalling = false;
        this.paginator.length = 0;
        this.cd.detectChanges();
      }
    });

    this.subs.add(subs);
    
    // const subs = this.paginator.page.pipe(startWith({})).pipe(
    //   tap(() => {
    //     this.isApiCalling = true;
    //     this.topBuyerData = [];
    //   }),
    //   debounceTime(300),
    //   switchMap(() => {
    //     let params: HttpParams = new HttpParams();

    //     params = params.set('page', String(this.paginator.pageIndex + 1)).set('limit', String(this.paginator.pageSize));

    //     return this.reportService.getTopTenBuyer(params);
    //   })
    // ).subscribe({
    //   next: (v: any) => {
    //     if (v.status) {
    //       this.topBuyerData = v.data;
    //       this.paginator.length = v.total;
    //     } else {
    //       this.toastrService.error(v.message);
    //       this.paginator.length = 0;
    //     }
    //     this.isApiCalling = false;
    //     this.cd.markForCheck();
    //   },
    //   error: (v) => {
    //     this.toastrService.error(v.message);
    //     this.isApiCalling = false;
    //     this.paginator.length = 0;
    //     this.cd.markForCheck();
    //   }
    // });

    // this.subs.add(subs);
  }

}
