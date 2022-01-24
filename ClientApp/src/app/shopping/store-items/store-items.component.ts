import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { StoreItem } from 'src/app/models/store-item.interface';
import { Store } from 'src/app/models/store.interface';
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
export class StoreItemsComponent implements OnInit {
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
  storeName$ = this.store$.pipe(map((store) => store.name));
  items$ = this.store$.pipe(map((store) => store.items));
  editing$ = this.topNav.editing$;

  newItemForm = new FormGroup({
    name: new FormControl(''),
    selected: new FormControl(false),
    completed: new FormControl(false)
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private topNav: TopNavService
  ) {
    this.topNav.updateTopNav('Loading...', ['shopping', 'stores'], true);
  }

  ngOnInit(): void {}

  addItem(): void {
    if (!this.newItemForm.value.name) {
      return;
    }

    this.http
      .post<Store>(`/api/stores/${this.route.snapshot.params.storeId}/items`, this.newItemForm.value)
      .subscribe(() => {
        this.newItemForm.reset();
        this.snackBar.open('Item added', 'OK', { duration: 2000 });
        this.refresh$.next();
      });
  }

  deleteItem(item: StoreItem): void {
    confirm('Are you sure you want to delete this item?') &&
      this.http.delete(`/api/stores/${this.route.snapshot.params.storeId}/items/${item.storeItemId}`).subscribe(() => {
        this.refresh$.next();
      });
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  isSelected(o1: StoreItem, o2: StoreItem): boolean {
    return o1.selected === o2.selected;
  }

  trackByStoreItemId(index: number, item: StoreItem): string {
    return item.storeItemId.toString();
  }
}
