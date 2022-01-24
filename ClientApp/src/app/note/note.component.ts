import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {
  showNote$ = new BehaviorSubject<boolean>(true);

  constructor() {}

  ngOnInit(): void {}

  closeNote(): void {
    this.showNote$.next(false);
  }
}
