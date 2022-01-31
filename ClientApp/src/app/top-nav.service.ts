import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

export interface TopNavSettings {
  title: string;
  backRoute?: string[] | null;
  editable?: boolean;
  settingsUrl?: string[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class TopNavService implements OnDestroy {
  backRoute$ = new BehaviorSubject<string[] | null | undefined>(undefined);
  title$ = new BehaviorSubject<string>('Loading...');
  editing$ = new BehaviorSubject<boolean>(false);
  editable$ = new BehaviorSubject<boolean | undefined>(false);
  settingsUrl$ = new BehaviorSubject<string[] | null | undefined>(undefined);

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

  updateTopNav(settings: TopNavSettings): void {
    this.title$.next(settings.title);
    this.backRoute$.next(settings.backRoute);
    this.editable$.next(settings.editable);
    this.settingsUrl$.next(settings.settingsUrl);
  }
}
