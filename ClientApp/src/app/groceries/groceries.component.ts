import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopNavService } from '../top-nav.service';

@Component({
  selector: 'app-groceries',
  templateUrl: './groceries.component.html',
  styleUrls: ['./groceries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-groceries'
  }
})
export class GroceriesComponent implements OnInit {
  constructor(private router: Router, private topNav: TopNavService) {
    this.topNav.updateTopNav('Groceries', ['']);
  }

  ngOnInit(): void {}

  onBack(): void {
    this.router.navigate(['']);
  }
}
