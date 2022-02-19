import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { StoreItem } from 'src/app/models/store-item.interface';
import { Store } from 'src/app/models/store.interface';
import { SignalrService } from 'src/app/signalr.service';
import { TopNavService } from 'src/app/top-nav.service';

@Component({
  selector: 'app-store-items',
  templateUrl: './store-items.component.html',
  styleUrls: ['./store-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-store-items'
  }
})
export class StoreItemsComponent implements OnInit, OnDestroy {
  private refresh$ = new Subject();

  store$ = this.refresh$.pipe(
    startWith(null),
    switchMap(() => this.http.get<Store>(`/api/stores/${this.route.snapshot.params.storeId}`)),
    catchError((err) => {
      console.error(err);

      this.snackBar
        .open('Error loading stores', 'TRY AGAIN', { duration: 2000 })
        .onAction()
        .subscribe(() => {
          this.refresh$.next();
        });

      throw err;
    }),
    tap((store) => {
      this.topNav.title$.next(`${store.name} items`);
      store.items.length === 0 ? this.topNav.editing$.next(true) : null;
    }),
    shareReplay(1)
  );

  searchControl = new FormControl('');

  storeName$ = this.store$.pipe(map((store) => store.name));
  items$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    switchMap((value) =>
      this.store$.pipe(
        map((store) =>
          store.items.filter((item) => !value || item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
        )
      )
    )
  );
  editing$ = this.topNav.editing$;

  newItemForm = new FormGroup({
    name: new FormControl(''),
    selected: new FormControl(false),
    completed: new FormControl(false)
  });

  private destroy$ = new Subject();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private topNav: TopNavService,
    private signalr: SignalrService
  ) {
    this.topNav.updateTopNav({ title: 'Loading...', backRoute: ['shopping', 'stores'], editable: true });
    this.signalr.refresh$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refresh$.next());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {}

  clearSearch(): void {
    this.searchControl.reset();
  }

  addItem(): void {
    if (!this.newItemForm.value.name) {
      return;
    }

    var payload = this.newItemForm.value;

    this.newItemForm.patchValue({
      name: ''
    });

    this.http
      .put<Store>(`/api/stores/${this.route.snapshot.params.storeId}/items/${payload.name}`, payload)
      .subscribe(() => {
        this.snackBar.open('Item added', 'OK', { duration: 2000 });
        this.refresh$.next();
      });
  }

  deleteItem(event: Event, item: StoreItem): void {
    event.stopPropagation();

    confirm('Are you sure you want to delete this item?') &&
      this.http.delete(`/api/stores/${this.route.snapshot.params.storeId}/items/${item.name}`).subscribe(() => {
        this.refresh$.next();
      });
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  selectionChange(e: MatSelectionListChange) {
    forkJoin(
      e.options.map((option) =>
        this.http.put(
          `/api/stores/${this.route.snapshot.params.storeId}/items/${option.value.name}/selected`,
          option.selected
        )
      )
    ).subscribe(() => {
      this.refresh$.next();
    });
  }

  isSelected(o1: StoreItem, o2: StoreItem): boolean {
    return o1.name === o2.name && o1.selected === o2.selected;
  }

  trackByStoreItemId(index: number, item: StoreItem): string {
    return item.name.toString();
  }

  compareItems(o1: StoreItem, o2: StoreItem) {
    return o1 && o2 && o1.name == o2.name;
  }
}
