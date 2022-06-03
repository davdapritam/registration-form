import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ProductReportComponent } from './product-report/product-report.component';
import { TopBuyerReportComponent } from './top-buyer-report/top-buyer-report.component';
import { MaterialModule } from '../../material/material.module';


@NgModule({
  declarations: [
    ProductReportComponent,
    TopBuyerReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule
  ],
  exports: [
    ProductReportComponent,
    TopBuyerReportComponent
  ]
})
export class ReportsModule { }
