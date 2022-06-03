import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductReportComponent } from './product-report/product-report.component';
import { TopBuyerReportComponent } from './top-buyer-report/top-buyer-report.component';

const routes: Routes = [
  {
    path: 'product',
    component: ProductReportComponent
  },
  {
    path: 'top-10-buyer',
    component: TopBuyerReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
