import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../models/store.interface';

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
  stores$ = this.http.get<Store[]>('/stores');

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {}

  onBack(): void {
    this.router.navigate(['/']);
  }
}
