import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../models/store.interface';
import { TopNavService } from '../top-nav.service';

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
  stores$ = this.http.get<Store[]>('/api/shopping/list');

  constructor(private router: Router, private http: HttpClient, private topNav: TopNavService) {
    this.topNav.updateTopNav('Shopping list', ['shopping']);
  }

  ngOnInit(): void {}

  onBack(): void {
    this.router.navigate(['/']);
  }

  trackByStoreId(index: number, store: Store): string {
    return store.storeId.toString();
  }
}
