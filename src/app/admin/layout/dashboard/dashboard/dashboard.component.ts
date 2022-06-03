import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap } from 'rxjs/operators';
import { DashboardService, IToalCount } from 'src/app/services/admin/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit {

  isApiCalling: boolean = false;

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;
  isTotalCount$: Observable<IToalCount>;

  dateRangeFG: FormGroup;

  subs: Subscription;

  constructor(
    private dashboardService: DashboardService,
    public breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {

    this.subs = new Subscription();

    const date = new Date();

    this.dateRangeFG = new FormGroup({
      start_date: new FormControl(new Date(date.getTime() - date.getTimezoneOffset() * 6000).toISOString().split('T')[0], [Validators.required]),
      end_date: new FormControl(new Date(date.getTime() - date.getTimezoneOffset() * 6000).toISOString().split('T')[0], [Validators.required])
    });

    this.isTotalCount$ = this.dateRangeFG.statusChanges.pipe(
      startWith('VALID'),
      debounceTime(300),
      filter(v => v === 'VALID'),
      switchMap(() => {
        const startDate = new Date(this.dateRangeFG.get('start_date')?.value).toISOString().split('T')[0];
        const endDate = new Date(this.dateRangeFG.get('end_date')?.value).toISOString().split('T')[0];

        const params = new HttpParams().set('starting_date', startDate).set('ending_date', endDate);

        return this.dashboardService.getTotalDashboard(params).pipe(map(v => v.data));
      })
    );
    
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
  }
}
