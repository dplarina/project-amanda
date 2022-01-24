import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GroceryListComponent } from '../grocery-list/grocery-list.component';
import { GroceriesRoutingModule } from './groceries-routing.module';
import { GroceriesComponent } from './groceries.component';
import { StoreItemsComponent } from './store-items/store-items.component';
import { StoreListComponent } from './store-list/store-list.component';

@NgModule({
  declarations: [StoreListComponent, StoreItemsComponent, GroceriesComponent, GroceryListComponent],
  imports: [
    CommonModule,
    GroceriesRoutingModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSnackBarModule
  ]
})
export class GroceriesModule {}
