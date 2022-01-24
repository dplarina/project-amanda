import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroceryListComponent } from '../grocery-list/grocery-list.component';
import { GroceriesComponent } from './groceries.component';
import { StoreItemsComponent } from './store-items/store-items.component';
import { StoreListComponent } from './store-list/store-list.component';

const routes: Routes = [
  { path: '', component: GroceriesComponent },
  { path: 'list', component: GroceryListComponent },
  { path: 'stores', component: StoreListComponent },
  { path: 'stores/:storeId', component: StoreItemsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroceriesRoutingModule {}
