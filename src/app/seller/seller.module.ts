import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { SellerRoutingModule } from './seller-routing.module';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChipsComponent } from '../shared/components/chips/chips.component';
import { CalculateComissionPipe } from '../pipes/calculate-comission.pipe';
import { ProductImageComponent } from './components/product-image/product-image.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ChartsComponent } from '../shared/components/charts/charts.component';
import { GrowthComponent } from './components/growth/growth.component';
import { ReportsComponent } from './components/reports/reports.component';
import { PerformanceComponent } from './components/performance/performance.component';
import { HelpComponent } from './components/help/help.component';
import { AddBulkProductComponent } from './components/add-bulk-product/add-bulk-product.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { MaterialModule } from '../admin/material/material.module';


@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    ProductsComponent,
    AddProductComponent,
    ChipsComponent,
    CalculateComissionPipe,
    ProductImageComponent,
    EditProductComponent,
    OrdersComponent,
    PaymentComponent,
    ChartsComponent,
    GrowthComponent,
    ReportsComponent,
    PerformanceComponent,
    HelpComponent,
    AddBulkProductComponent,
    SellerProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SellerRoutingModule,
    FormsModule,
    NgSelectModule,
    NgChartsModule,
    NgbModule,
    MaterialModule
  ],
  entryComponents: [ProductImageComponent]
})
export class SellerModule { }
