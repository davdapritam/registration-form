import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { CampaignService, ICampaign } from 'src/app/services/admin/campaign.service';
import { AddCampaignComponent } from '../add-campaign/add-campaign.component';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements AfterViewInit, OnDestroy {

  isApiCalling: boolean = false;

  desktopDisplayedColumns = ['name', 'service_type', 'email_subject', 'message', 'campaign_type', 'status', 'schedule_datetime'];
  mobileDisplayedColumns = ['details'];

  campaignData: ICampaign[] = [];

  subs: Subscription;

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  campaignSearchFC: FormControl;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private campaignService: CampaignService,
    private toastrService: ToastrService,
    public matDialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {

    this.subs = new Subscription();

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})));

    this.isApiCalling = true;

    this.campaignSearchFC = new FormControl(null);
    this.campaignService.getCampaign(new HttpParams()).subscribe(v => console.log('::: v', v));
  }

  ngAfterViewInit(): void {
    
    const subs = combineLatest([
      this.paginator.page.pipe(startWith({})),
      this.campaignSearchFC.valueChanges.pipe(
        startWith(this.campaignSearchFC.value),
      ),
    ]).pipe(
      tap(() => {
        this.isApiCalling = true;
        this.campaignData = [];
      }),
      debounceTime(300),
      // tap(() => {
      //   this.isApiCalling = true;
      //   this.campaignData = [];
      // }),
      switchMap(() => {

        let params: HttpParams = new HttpParams();

        if (!!this.campaignSearchFC.value && this.campaignSearchFC.value.trim() !== '') {
          params = params.set('search', this.campaignSearchFC.value);

          this.paginator.pageIndex = 0;
        }

        params = params.set('page', String(this.paginator.pageIndex + 1)).set('limit', String(this.paginator.pageSize));

        return this.campaignService.getCampaign(params);
      })
    ).subscribe({
      next: (v) => {
        if (v.status) {
          this.campaignData = v.data;
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
    
  }

  addCampaign(): void {
    this.matDialog.open(AddCampaignComponent)
  }
}
