import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ChangeCategoryDialogComponent } from './change-category-dialog/change-category-dialog.component';
import { HomeComponent } from './home/home.component';
import { UpdateService } from './update.service';

@NgModule({
  declarations: [AppComponent, HomeComponent, ChangeCategoryDialogComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then((m) => m.CalendarModule)
      },
      {
        path: 'shopping',
        loadChildren: () => import('./shopping/shopping.module').then((m) => m.ShoppingModule)
      },
      {
        path: 'lists',
        loadChildren: () => import('./lists/lists.module').then((m) => m.ListsModule)
      },
      {
        path: 'notes',
        loadChildren: () => import('./notes/notes.module').then((m) => m.NotesModule)
      },
      { path: '**', redirectTo: '' }
    ]),
    BrowserAnimationsModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(updateService: UpdateService) {
    updateService.init();
  }
}
