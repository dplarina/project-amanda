import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TopNavService implements OnDestroy {
  backRoute$ = new BehaviorSubject<string[] | null>(null);
  title$ = new BehaviorSubject<string>('Loading...');
  editing$ = new BehaviorSubject<boolean>(false);
  editable$ = new BehaviorSubject<boolean>(false);

  private destroy$ = new Subject();

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.editing$.next(false);
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  updateTopNav(title: string, backRoute: string[] | null, editable: boolean = false): void {
    this.title$.next(title);
    this.backRoute$.next(backRoute);
    this.editable$.next(editable);
  }
}
