import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

// import 'rxjs';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class CurrentPageService {
  public routeData: {
    templateView?: string,
    pageTitle?: string
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.router.events
    .filter(event => event instanceof NavigationEnd)
    .map(() => this.route)
    .map(route => {
      while (route.firstChild) route = route.firstChild;
      return route;
    })
    .filter(route => route.outlet === 'primary')
    .mergeMap(route => route.data)
    .subscribe((event) => {
      this.routeData = event;
    });
  }
}
