import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreItemsComponent } from './store-items/store-items.component';
import { StoreListComponent } from './store-list/store-list.component';

const routes: Routes = [
  { path: '', component: StoreListComponent },
  { path: 'stores/:storeId', component: StoreItemsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroceriesRoutingModule { }
