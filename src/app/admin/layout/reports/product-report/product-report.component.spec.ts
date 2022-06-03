import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReportComponent } from './product-report.component';

describe('ProductReportComponent', () => {
  let component: ProductReportComponent;
  let fixture: ComponentFixture<ProductReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
