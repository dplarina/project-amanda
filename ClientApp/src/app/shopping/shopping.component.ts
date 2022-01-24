import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopNavService } from '../top-nav.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-shopping'
  }
})
export class ShoppingComponent implements OnInit {
  constructor(private router: Router, private topNav: TopNavService) {
    this.topNav.updateTopNav('Shopping', null);
  }

  ngOnInit(): void {}

  onBack(): void {
    this.router.navigate(['']);
  }
}
