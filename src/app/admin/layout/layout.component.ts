import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {

  routerDatas = [
    {
      displayName: 'Dashboard',
      routerLink: ['dashboard']
    },
    {
      displayName: 'User',
      routerLink: ['user']
    },
    {
      displayName: 'Product',
      routerLink: ['product']
    },
    {
      displayName: 'Order',
      routerLink: ['order']
    },
    {
      displayName: 'Campaign',
      routerLink: ['campaign']
    }
  ];

  // hold the breakpoints
  isMobile$: Observable<{mobile: boolean}>;

  isOpen$: Observable<boolean>;

  constructor(
    public breakpointObserver: BreakpointObserver,
    public router: Router,
    public route: ActivatedRoute
  ) {

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => {

      this.router.navigate([this.router.url.split('?')[0]], {
        relativeTo: this.route,
        queryParams: {isOpen: !v.matches}
      });

      return {mobile: v.matches};
    }));

    this.isOpen$ = this.route.queryParams.pipe(map(v => v?.isOpen === 'false'));
  }

  navigateToMenu(navigationMenu: string[] | null, isMobile: boolean | undefined) {

    if (!!navigationMenu) {
      this.router.navigate(navigationMenu, {
        relativeTo: this.route,
        queryParams: {isOpen: isMobile ? this.route.snapshot.queryParams?.isOpen === 'false' : this.route.snapshot.queryParams?.isOpen}
      });
    } else {

      localStorage.removeItem('authToken');
      this.router.navigate(['/']);
    }
  }

  changeDrawerState() {

    this.router.navigate([this.router.url.split('?')[0]], {
      relativeTo: this.route,
      queryParams: {isOpen: this.route.snapshot.queryParams?.isOpen === 'false'}
    });
  }
}
