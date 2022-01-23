import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GroceriesRoutingModule } from './groceries-routing.module';
import { StoreItemsComponent } from './store-items/store-items.component';
import { StoreListComponent } from './store-list/store-list.component';

@NgModule({
  declarations: [StoreListComponent, StoreItemsComponent],
  imports: [
    CommonModule,
    GroceriesRoutingModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ]
})
export class GroceriesModule {}
