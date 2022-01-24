import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../models/store.interface';
import { TopNavService } from '../top-nav.service';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-grocery-list'
  }
})
export class GroceryListComponent implements OnInit {
  stores$ = this.http.get<Store[]>('/api/groceries/list');

  constructor(private router: Router, private http: HttpClient, private topNav: TopNavService) {
    this.topNav.updateTopNav('Grocery list', ['groceries']);
  }

  ngOnInit(): void {}

  onBack(): void {
    this.router.navigate(['/']);
  }

  trackByStoreId(index: number, store: Store): string {
    return store.storeId.toString();
  }
}
