import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from 'src/app/models/store.interface';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  stores$ = this.http.get<Store[]>('/stores');

  newStoreForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  addStore(): void {
    this.http
      .post<Store>('/stores', {
        name: this.newStoreForm.value.name,
        items: []
      })
      .subscribe((store) => {
        this.stores$ = this.http.get<Store[]>('/stores');
      });
  }
}
