import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkProductComponent } from './add-bulk-product.component';

describe('AddBulkProductComponent', () => {
  let component: AddBulkProductComponent;
  let fixture: ComponentFixture<AddBulkProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBulkProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBulkProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
