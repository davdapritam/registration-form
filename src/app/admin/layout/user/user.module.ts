import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { MaterialModule } from '../../material/material.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserUpdateComponent } from './user-update/user-update.component';


@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserUpdateComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule
  ],
  entryComponents: [
    UserUpdateComponent
  ]
})
export class UserModule { }
