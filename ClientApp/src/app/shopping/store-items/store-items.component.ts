import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ChangeCategoryDialogService } from 'src/app/change-category-dialog/change-category-dialog.service';
import { ItemCategory } from 'src/app/enums';
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
  categories$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    switchMap((query) =>
      this.store$.pipe(
        map((store) =>
          Object.entries(ItemCategory).map(([name, categoryId]) => ({
            categoryId: +(categoryId ?? 1),
            name: name,
            items: store.items
              .filter(
                (item) =>
                  (!query || item.name.toLowerCase().indexOf(query.toLowerCase()) > -1) &&
                  ((!item.categoryId && categoryId == 1) || item.categoryId == categoryId)
              )
              .map((item) => ({ ...item, categoryId: +(item.categoryId ?? 1) }))
              .sort((a, b) => (a.name < b.name ? -1 : 1))
          }))
        )
      )
    )
  );

  editingCategoryId$ = new BehaviorSubject<number | null>(null);

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
    private signalr: SignalrService,
    private changeCategoryDialog: ChangeCategoryDialogService
  ) {
    this.topNav.updateTopNav({ title: 'Loading...', backRoute: ['shopping', 'stores'] });
    this.signalr.refresh$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refresh$.next());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {}

  clearSearch(): void {
    this.searchControl.reset();
  }

  changeCategory(item: StoreItem, event: Event): void {
    event.stopPropagation();

    this.changeCategoryDialog
      .open(item.categoryId)
      .afterClosed()
      .subscribe((categoryId) => {
        if (categoryId) {
          this.http
            .put(`/api/stores/${this.route.snapshot.params.storeId}/items/${item.name}/category`, categoryId)
            .subscribe(() => {
              this.refresh$.next();
            });
        }
      });
  }

  toggleEdit(categoryId: number): void {
    // if we're editing the selected category, stop
    if (this.editingCategoryId$.value === categoryId) {
      this.editingCategoryId$.next(null);
      return;
    }

    this.editingCategoryId$.next(categoryId);
  }

  addItem(categoryId: number): void {
    if (!this.newItemForm.value.name) {
      return;
    }

    var payload = {
      ...this.newItemForm.value,
      categoryId
    };

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
