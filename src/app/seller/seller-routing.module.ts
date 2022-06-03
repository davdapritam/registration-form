import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AddProductComponent } from './components/add-product/add-product.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { ProductsComponent } from './components/products/products.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PaymentComponent } from './components/payment/payment.component';
import { GrowthComponent } from './components/growth/growth.component';
import { ReportsComponent } from './components/reports/reports.component';
import { PerformanceComponent } from './components/performance/performance.component';
import { HelpComponent } from './components/help/help.component';
import { AddBulkProductComponent } from './components/add-bulk-product/add-bulk-product.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],data: { role: ['SELLER'] } },
      { path: 'products', component: ProductsComponent, canActivate: [AuthGuard], data: { role: ['SELLER'] } },
      { path: 'addProduct', component: AddProductComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true } },
      { path: 'addBulkProduct', component: AddBulkProductComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true } },
      { path: 'editProduct/:id', component: EditProductComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true } },
      { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true } },
      { path: 'payments', component: PaymentComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true } },
      { path: 'growth', component: GrowthComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true }},
      { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true }},
      { path: 'performances', component: PerformanceComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true }},
      { path: 'help', component: HelpComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true }},
      { path: 'profile', component: SellerProfileComponent, canActivate: [AuthGuard], data: { role: ['SELLER'], checkStatus: true } },
      {
        path: 'product', loadChildren: () => import('./components/product/product.module').then(m => m.ProductModule)
      },
      { path: '', redirectTo: '/seller/dashboard' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
