import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './product-routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { MaterialModule } from 'src/app/admin/material/material.module';
import { AddProductImageComponent } from './add-product-image/add-product-image.component';


@NgModule({
  declarations: [
    AddProductComponent,
    AddProductImageComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MaterialModule
  ]
})
export class ProductModule { }
