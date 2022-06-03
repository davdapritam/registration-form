import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { IOrder, OrderService } from 'src/app/services/admin/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent implements OnInit {

  subs: Subscription;

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  isApiCalling = false;

  productData: IOrder | null = null;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver,
    public cd: ChangeDetectorRef
  ) {

    this.subs = new Subscription();

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})), shareReplay(1));

    this.route.paramMap.pipe(
      switchMap((v) => this.orderService.getSingleOrder(v.get('id') as string))
    ).subscribe(v => {
      this.productData = v.data;
      console.log('::: order detail', v, this.productData.product.productName);
      this.cd.markForCheck();
    });
    // this.orderService.getSingleOrder()
  }

  ngOnInit(): void {
  }

}
