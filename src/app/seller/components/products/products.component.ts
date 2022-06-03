import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ProductService } from '../../services/products/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: Array<any> = [];

  constructor(private toast: ToastrService, private element: ElementRef, private product: ProductService) {}

  ngOnInit(): void {
    this.product.getProducts(null, {status: 'active', approved: true}).subscribe(products => {
      this.products = products.data;
      console.log(':::::::::::::::products.data::::::::::::::::::::::', products.data);
    }, err => {
      this.toast.error(err.message, 'Error Occured');
    });
  }

  ngAfterViewInit(): void {
    this.element.nativeElement.querySelector('#active').classList.add('active');
  }

  filterProduct(status: string): void {
    this.element.nativeElement.querySelector('#active').classList.remove('active');
    this.element.nativeElement.querySelector('#pending').classList.remove('active');
    this.element.nativeElement.querySelector('#outOfStock').classList.remove('active');
    this.element.nativeElement.querySelector(`#${status}`).classList.add('active');
    this.product.getProducts(null, {status, approved: status === 'pending' ? false : true}).subscribe(async products => {
      this.products = products?.data ? products.data : [];
      console.log(':::::::::::::::Filter products.data::::::::::::::::::::::', products.data);
    }, err => {
      this.toast.error(err.message, 'Error Occured');
    });
  }

}
