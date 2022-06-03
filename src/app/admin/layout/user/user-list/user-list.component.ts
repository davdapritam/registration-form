import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { IUser, UserService } from 'src/app/services/admin/user.service';
import { USEROPTION } from 'src/app/services/utility';
import { UserUpdateComponent } from '../user-update/user-update.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {

  isApiCalling: boolean = false;

  desktopDisplayedColumns = ['name', 'email', 'mobile', 'creditLimit', 'status', 'action'];
  mobileDisplayedColumns = ['details', 'action'];

  userData: IUser[] = [];

  subs: Subscription;

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  userSearchFC: FormControl;
  userOptionFC: FormControl;

  USEROPTION = USEROPTION;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    public matDialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {

    this.subs = new Subscription();

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})));

    this.isApiCalling = true;

    this.userSearchFC = new FormControl(null);
    this.userOptionFC = new FormControl(this.USEROPTION.seller);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
    const subs = combineLatest([
      this.paginator.page.pipe(startWith({})),
      this.userSearchFC.valueChanges.pipe(
        startWith(this.userSearchFC.value),
      ),
      this.userOptionFC.valueChanges.pipe(
        startWith(this.userOptionFC.value),
      )
    ]).pipe(
      tap(() => {
        this.isApiCalling = true;
        this.userData = [];
      }),
      debounceTime(300),
      // tap(() => {
      //   this.isApiCalling = true;
      //   this.userData = [];
      // }),
      switchMap(() => {

        let params: HttpParams = new HttpParams();

        if (!!this.userOptionFC.value && this.userOptionFC.value !== '') {

          params = params.set('role', this.userOptionFC.value);
        }

        if (!!this.userSearchFC.value && this.userSearchFC.value.trim() !== '') {
          params = params.set('search', this.userSearchFC.value);

          this.paginator.pageIndex = 0;
        }

        params = params.set('page', String(this.paginator.pageIndex + 1)).set('limit', String(this.paginator.pageSize));

        return this.userService.getUser(params);
      })
    ).subscribe({
      next: (v) => {
        if (v.status) {
          this.userData = v.data;
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

  approvedUser(id: string, isApproved: boolean): void {
    const d = {
      status: isApproved ? 'active' : 'new',
      approved: isApproved
    }
    this.userService.approveUser(id, d).pipe(
      switchMap(v => {
        if (v.status) {

          this.toastrService.success(v.message);

          this.isApiCalling = true;
          this.userData = [];

          // const params: HttpParams = new HttpParams().set('role', this.userOptionFC.value);

          let params: HttpParams = new HttpParams();

          if (!!this.userOptionFC.value && this.userOptionFC.value !== '') {

            params = params.set('role', this.userOptionFC.value);
          }

          return this.userService.getUser(params);

        } else {

          this.toastrService.error(v.message);

          return of(null);
        }
      })
    ).subscribe({
      next: (v) => {
        if (v?.status) {
          this.userData = v.data;
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
  }

  editCreditLimit(data: IUser, isMobile = false): void {

    const subs = this.matDialog.open(UserUpdateComponent, {
      minWidth: isMobile ? '90%' : '400px',
      // minHeight: '350px',
      data
    }).afterClosed().subscribe(() => this.userOptionFC.setValue(this.userOptionFC.value));

    this.subs.add(subs);
  }
}
