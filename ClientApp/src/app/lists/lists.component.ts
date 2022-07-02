import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap, shareReplay, takeUntil, startWith, switchMap } from 'rxjs/operators';
import { List } from 'src/app/models/list.interface';
import { TopNavService } from 'src/app/top-nav.service';
import { retryBackoff } from 'backoff-rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { ListItem } from '../models/list-item.interface';
import { NgForm } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ItemCategory } from '../enums';
import { SignalrService } from '../signalr.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-lists'
  }
})
export class ListsComponent implements OnInit, OnDestroy {
  refresh$ = new Subject();

  lists$ = this.refresh$.pipe(
    startWith(null),
    switchMap(() => this.http.get<List[]>('/api/lists')),
    retryBackoff({
      initialInterval: 100,
      maxRetries: 5,
      resetOnSuccess: true
    }),
    catchError((err, caught) => {
      console.error(err);

      this.snackBar
        .open('Error loading lists', 'TRY AGAIN', { duration: 2000 })
        .onAction()
        .subscribe(() => caught);

      throw err;
    }),
    shareReplay(1)
  );

  editingItem$ = new BehaviorSubject<ListItem | null>(null);

  addItemName = '';
  editItemName = '';

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private topNav: TopNavService,
    private signalr: SignalrService
  ) {
    this.topNav.updateTopNav({ title: 'Lists' });
    this.signalr.refresh$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refresh$.next());
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  addList(): void {}

  renameList(list: List): void {}
  deleteList(list: List): void {}
  deleteCheckedInList(list: List): void {}
  checkAllInList(list: List): void {}
  uncheckAllInList(list: List): void {}

  addItem(list: List): void {
    const newItem = { categoryId: ItemCategory.Vegetables, name: this.addItemName, selected: false, completed: false };
    list.items.unshift(newItem);
    this.saveListItem(list);
    this.addItemName = '';
  }
  clearEditingItem(): void {
    this.editingItem$.next(null);
    this.editItemName = '';
  }
  editListItem(item: ListItem): void {
    this.editItemName = item.name;
    this.editingItem$.next(item);
    requestAnimationFrame(() => {
      document.getElementById('editNameInput')!.focus();
    });
  }
  saveListItem(list: List, item?: ListItem, form?: NgForm): void {
    if (!form || form.valid) {
      if (item) {
        item.name = this.editItemName;
      }
      this.http.put<List>(`/api/lists/${list.name}`, list).subscribe();
      this.clearEditingItem();
    }
  }
  deleteListItem(event: Event, list: List, item: ListItem): void {
    event.stopPropagation();
    list.items = list.items.filter((i) => i.name !== item.name);

    this.saveListItem(list, item);
  }

  drop(event: CdkDragDrop<ListItem[]>, list: List) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    this.http.put<List>(`/api/lists/${list.name}`, list).subscribe();
  }

  trackByListETag(index: number, list: List): string {
    return list.ETag;
  }

  trackByItemId(index: number, item: ListItem): string {
    return index.toString();
  }
}
