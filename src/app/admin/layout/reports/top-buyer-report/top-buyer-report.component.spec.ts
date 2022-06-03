import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBuyerReportComponent } from './top-buyer-report.component';

describe('TopBuyerReportComponent', () => {
  let component: TopBuyerReportComponent;
  let fixture: ComponentFixture<TopBuyerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopBuyerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBuyerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
