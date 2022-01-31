import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TopNavService } from '../top-nav.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  constructor(private topNav: TopNavService) {
    this.topNav.updateTopNav({ title: 'Calendar' });
  }

  ngOnInit(): void {}
}
