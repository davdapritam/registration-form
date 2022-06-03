import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreakpointsService {

  // hold the breakpoints
  private isMobile$: Observable<{mobile: boolean}>;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(v => ({mobile: v.matches})));
  }

  getMobileBreakPointObs$() {

    return this.isMobile$;
  }
}
