import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { retryBackoff } from 'backoff-rxjs';
import { Subject } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { Store } from 'src/app/models/store.interface';
import { TopNavService } from 'src/app/top-nav.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-store-list'
  }
})
export class StoreListComponent implements OnInit {
  private refresh$ = new Subject();

  editing$ = this.topNav.editing$;

  stores$ = this.refresh$.pipe(
    startWith({}),
    switchMap(() => this.http.get<Store[]>('/api/stores')),
    retryBackoff({
      initialInterval: 100,
      maxRetries: 5,
      resetOnSuccess: true
    }),
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
    tap((stores) => (stores.length === 0 ? this.topNav.editing$.next(true) : null)),
    shareReplay(1)
  );

  newStoreForm = new FormGroup({
    name: new FormControl('')
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private topNav: TopNavService,
    private snackBar: MatSnackBar
  ) {
    this.topNav.updateTopNav('Stores', ['shopping'], true);
  }

  ngOnInit(): void {}

  addStore(): void {
    if (!this.newStoreForm.value.name) {
      return;
    }

    var payload = this.newStoreForm.value;

    this.newStoreForm.patchValue({
      name: ''
    });

    this.http
      .post<Store>('/api/stores', payload)
      .subscribe((store) => {
        this.snackBar.open('Store added', 'OK', { duration: 2000 });
        this.refresh$.next();
      });
  }

  deleteStore(store: Store): void {
    if (confirm(`Are you sure you want to delete ${store.name}?`)) {
      this.http.delete(`/api/stores/${store.storeId}`).subscribe(() => {
        this.snackBar.open('Store deleted', 'OK', { duration: 2000 });
        this.refresh$.next();
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  trackByStoreId(index: number, store: Store): string {
    return store.storeId.toString();
  }
}
