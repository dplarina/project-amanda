import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { retryBackoff } from 'backoff-rxjs';
import { forkJoin, Subject } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { SignalrService } from '../signalr.service';
import { Store } from '../models/store.interface';
import { TopNavService } from '../top-nav.service';
import { StoreItem } from '../models/store-item.interface';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-shopping-list'
  }
})
export class GroceryListComponent implements OnInit {
  private refresh$ = new Subject();

  stores$ = this.refresh$.pipe(
    startWith({}),
    switchMap(() => this.http.get<Store[]>('/api/shopping/list')),
    retryBackoff({
      initialInterval: 100,
      maxRetries: 5,
      resetOnSuccess: true
    }),
    catchError((err) => {
      console.error(err);

      this.snackBar
        .open('Error loading shopping list', 'TRY AGAIN', { duration: 2000 })
        .onAction()
        .subscribe(() => {
          this.refresh$.next();
        });

      throw err;
    }),
    shareReplay(1)
  );

  constructor(
    private router: Router,
    private http: HttpClient,
    private topNav: TopNavService,
    private snackBar: MatSnackBar,
    private changes: SignalrService
  ) {
    this.topNav.updateTopNav({ title: 'Shopping list', backRoute: ['shopping'], settingsUrl: ['shopping', 'stores'] });
  }

  ngOnInit(): void {
    this.changes.refresh$.subscribe(() => this.refresh$.next());
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  selectionChange(e: MatSelectionListChange) {
    forkJoin(
      e.options.map((option) =>
        this.http.put(`/api/stores/${option.value.name}/items/${option.value.name}/completed`, option.selected)
      )
    ).subscribe(() => {
      this.refresh$.next();
    });
  }

  trackByStoreId(index: number, store: Store): string {
    return store.name.toString();
  }

  trackByStoreItemId(index: number, item: StoreItem): string {
    return item.name.toString();
  }

  compareItems(o1: StoreItem, o2: StoreItem): boolean {
    return o1 && o2 && o1.name === o2.name;
  }
}
