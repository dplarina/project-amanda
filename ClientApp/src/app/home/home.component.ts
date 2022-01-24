import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TopNavService } from '../top-nav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-home'
  }
})
export class HomeComponent implements OnInit {
  constructor(private topNav: TopNavService) {
    this.topNav.updateTopNav('Home', null);
  }

  ngOnInit(): void {}
}
