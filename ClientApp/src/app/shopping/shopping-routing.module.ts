import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroceryListComponent as ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { ShoppingComponent } from './shopping.component';
import { StoreItemsComponent } from './store-items/store-items.component';
import { StoreListComponent } from './store-list/store-list.component';

const routes: Routes = [
  { path: '', component: ShoppingComponent },
  { path: 'list', component: ShoppingListComponent },
  { path: 'stores', component: StoreListComponent },
  { path: 'stores/:storeId', component: StoreItemsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule {}
