import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { ItemCategory } from '../enums';

@Component({
  selector: 'app-change-category-dialog',
  templateUrl: './change-category-dialog.component.html',
  styleUrls: ['./change-category-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeCategoryDialogComponent implements OnInit {
  categories = Object.entries(ItemCategory).map(([name, categoryId]) => ({
    id: +categoryId,
    name: name
  }));

  constructor(
    @Inject(MAT_DIALOG_DATA) public categoryId: number,
    private mdDialogRef: MatDialogRef<ChangeCategoryDialogComponent>
  ) {}

  ngOnInit(): void {}

  change(event: MatRadioChange): void {
    this.mdDialogRef.close(event.value);
  }

  compareCategory(c1: any, c2: any): boolean {
    if (c1 && c2) {
      return c1.id === c2.id;
    }
    return false;
  }
}
