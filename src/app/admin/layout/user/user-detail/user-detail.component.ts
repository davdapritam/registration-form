import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { IUser, UserService } from 'src/app/services/admin/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent implements OnInit {

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  userDetailForm!: FormGroup;

  isApiCalling = false;

  constructor(
    public route: ActivatedRoute,
    private userService: UserService,
    private toastrService: ToastrService,
    public breakpointObserver: BreakpointObserver,
    public cd: ChangeDetectorRef
  ) {

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})), shareReplay(1));

    this.route.paramMap.pipe(
      // filter(v => v.has('id')),
      switchMap(v => this.userService.getSingleUser(v.get('id')))
    ).subscribe({
      next: (v) => {
        if (v.status) {
          this.createForm(v.data)
        } else {
          this.toastrService.error(v.message);
          this.createForm(null);
        }
        this.cd.detectChanges();
      },
      error: () => {}
    })
  }

  ngOnInit(): void {
  }

  createForm(d: IUser | null): void {

    this.userDetailForm = new FormGroup({
      PANNumber: new FormControl(d?.PANNumber || null),
      approved: new FormControl(d?.approved || null),
      bank: new FormGroup({
        accountNumber: new FormControl(d?.bank?.accountNumber || null),
        bankName: new FormControl(d?.bank?.bankName || null),
        firm: new FormControl(d?.bank?.firm || null),
        ifscCode: new FormControl(d?.bank?.ifscCode || null),
        user: new FormControl(d?.bank?.user || null),
        _id: new FormControl(d?.bank?._id || null)
      }),
      creditLimit: new FormControl(d?.creditLimit || null),
      docs: new FormControl([]),
      email: new FormControl(d?.email || null),
      firm: new FormGroup({
        GSTNumber: new FormControl(d?.firm?.GSTNumber || null),
        address: new FormControl(d?.firm?.address?.addessLine1.concat(' ', d?.firm?.address?.addessLine2, ' ', d?.firm?.address?.city, ' ', d?.firm?.address?.state, ' ',  d?.firm?.address?.country, ' - ', d?.firm?.address?.pincode) || null),
        firmName: new FormControl(d?.firm?.firmName || null),
        user: new FormControl(d?.firm?.user || null),
        _id: new FormControl(d?.firm?._id || null)
      }),
      firstName: new FormControl(d?.firstName || null),
      identityProofs: new FormControl([]),
      lastName: new FormControl(d?.lastName || null),
      mobile: new FormControl(d?.mobile || null),
      referredUser: new FormControl(d?.referredUser || null),
      role: new FormControl(d?.role || null),
      sellerRole: new FormControl(d?.sellerRole || null),
      status: new FormControl(d?.status || null),
      _id: new FormControl(d?._id || null),
    });

    this.userDetailForm.disable();
    // (this.userDetailForm.get('bank') as FormGroup)?.disable();

    this.cd.markForCheck();
  }

  update(): void {

    this.userDetailForm.markAllAsTouched();

    if (this.userDetailForm.valid) {


    }

    this.isApiCalling = true;
  }
}
