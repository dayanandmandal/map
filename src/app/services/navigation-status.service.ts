import { Injectable } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationStatusService {
  private isNavigatingSubject = new BehaviorSubject<boolean>(false);
  public isNavigating$: Observable<boolean> =
    this.isNavigatingSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isNavigatingSubject.next(true);
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isNavigatingSubject.next(false);
      }
    });
  }

  public get isNavigationOngoing(): boolean {
    return this.isNavigatingSubject.value;
  }
}
