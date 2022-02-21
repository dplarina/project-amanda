import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeCategoryDialogComponent } from './change-category-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ChangeCategoryDialogService {
  constructor(private dialog: MatDialog) {}

  public open(categoryId: number): MatDialogRef<ChangeCategoryDialogComponent> {
    return this.dialog.open(ChangeCategoryDialogComponent, {
      data: categoryId
    });
  }
}
