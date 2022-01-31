import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TopNavService } from '../top-nav.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnInit {
  constructor(private topNav: TopNavService) {
    this.topNav.updateTopNav({ title: 'To do' });
  }

  ngOnInit(): void {}
}
