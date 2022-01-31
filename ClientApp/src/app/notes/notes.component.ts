import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TopNavService } from '../top-nav.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  constructor(private topNav: TopNavService) {
    this.topNav.updateTopNav({ title: 'Notes' });
  }

  ngOnInit(): void {}
}
