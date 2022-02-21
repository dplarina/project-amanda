import { ApplicationRef, Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, interval, Subject } from 'rxjs';
import { filter, first, map, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpdateService implements OnDestroy {
  private destroy$ = new Subject();

  constructor(private appRef: ApplicationRef, private updates: SwUpdate, private snackBar: MatSnackBar) {}

  init(): void {
    // if service worker is not available, then do nothing
    if (!this.updates.isEnabled) {
      return;
    }
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));
    const everyMinute$ = interval(1 * 1 * 1000);
    const everyMinuteOnceAppIsStable$ = concat(appIsStable$, everyMinute$);

    everyMinuteOnceAppIsStable$.subscribe(() => this.updates.checkForUpdate());

    this.updates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt) => ({
          type: 'UPDATE_AVAILABLE',
          current: evt.currentVersion,
          available: evt.latestVersion
        })),
        tap((evt) => console.log('Update available:', evt)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updates.activateUpdate();
        // notify the user of a code update
        this.snackBar.open('Update available', 'Reload', {
          duration: 5000
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
