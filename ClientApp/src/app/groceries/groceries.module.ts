import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GroceryListComponent } from '../grocery-list/grocery-list.component';
import { NoteModule } from '../note/note.module';
import { GroceriesRoutingModule } from './groceries-routing.module';
import { GroceriesComponent } from './groceries.component';
import { StoreItemsComponent } from './store-items/store-items.component';
import { StoreListComponent } from './store-list/store-list.component';

@NgModule({
  declarations: [StoreListComponent, StoreItemsComponent, GroceriesComponent, GroceryListComponent],
  imports: [
    CommonModule,
    GroceriesRoutingModule,
    NoteModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSnackBarModule
  ]
})
export class GroceriesModule {}
