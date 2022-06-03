import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IUser, UserService } from 'src/app/services/admin/user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit, OnDestroy {

  isApiCalling: boolean = false;

  creditLimit = 0;

  subs: Subscription;

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: IUser,
    private dialogRef: MatDialogRef<UserUpdateComponent>
  ) {

    this.subs = new Subscription();
  }

  ngOnInit(): void {
    this.creditLimit = this.data.creditLimit;
  }

  ngOnDestroy(): void {
    
    this.subs.unsubscribe();
  }

  updateData(): void {

    this.isApiCalling = true;

    const subs = this.userService.updateCreditLimit(this.data._id, {creditLimit: this.creditLimit}).subscribe({
      next: (v) => {
        if (v.status) {
          this.toastrService.success(v.message);
          this.isApiCalling = false;
          this.dialogRef.close();
        } else {
          this.toastrService.error(v.message);
        }
      },
      error: (v) => {
        this.toastrService.error(v.message);
      }
    });

    this.subs.add(subs);
  }
}
