// user-dashboard-stats.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-dashboard-stats',
  templateUrl: './user-dashboard-stats.component.html',
  styleUrls: ['./user-dashboard-stats.component.scss']
})
export class UserDashboardStatsComponent implements OnInit {
  @Input() stats: any;

  constructor() { }

  ngOnInit(): void {
  }

  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return Array(fullStars + (hasHalfStar ? 1 : 0)).fill(0);
  }
}