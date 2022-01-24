import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { StoreItem } from 'src/app/models/store-item.interface';
import { Store } from 'src/app/models/store.interface';

@Component({
  selector: 'app-store-items',
  templateUrl: './store-items.component.html',
  styleUrls: ['./store-items.component.scss'],
  host: {
    class: 'app-store-items'
  }
})
export class StoreItemsComponent implements OnInit {
  @ViewChild('itemForm') itemForm!: NgForm;

  private refresh$ = new Subject();

  store$ = this.refresh$.pipe(
    startWith(null),
    switchMap(() => this.http.get<Store>(`/stores/${this.route.snapshot.params.storeId}`)),
    shareReplay(1)
  );
  storeName$ = this.store$.pipe(map((store) => store.name));
  items$ = this.store$.pipe(map((store) => store.items));

  newItemForm = new FormGroup({
    name: new FormControl(''),
    selected: new FormControl(false),
    completed: new FormControl(false)
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  addItem(): void {
    if (!this.newItemForm.value.name) {
      return;
    }

    this.http
      .post<Store>(`/stores/${this.route.snapshot.params.storeId}/items`, this.newItemForm.value)
      .subscribe(() => {
        this.newItemForm.reset();
        this.snackbar.open('Item added', 'OK', { duration: 2000 });
        this.refresh$.next();
      });
  }

  deleteItem(item: StoreItem): void {
    confirm('Are you sure you want to delete this item?') &&
      this.http.delete(`/stores/${this.route.snapshot.params.storeId}/items/${item.storeItemId}`).subscribe(() => {
        this.refresh$.next();
      });
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  isSelected(o1: StoreItem, o2: StoreItem): boolean {
    return o1.selected === o2.selected;
  }
}
