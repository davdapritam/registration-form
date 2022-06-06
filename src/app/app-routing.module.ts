import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddImageComponent } from './add-image/add-image.component';
import { AddProductComponent } from './add-product/add-product.component';

const routes: Routes = [
  {path:'addProduct', component: AddProductComponent },
  {path:'addImage', component:AddImageComponent},
  {path:'', redirectTo:'addImage', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
