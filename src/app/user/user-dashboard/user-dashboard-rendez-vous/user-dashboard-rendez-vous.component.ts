// user-dashboard-rendez-vous.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-dashboard-rendez-vous',
  templateUrl: './user-dashboard-rendez-vous.component.html',
  styleUrls: ['./user-dashboard-rendez-vous.component.scss']
})
export class UserDashboardRendezVousComponent implements OnInit {
  @Input() appointments: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}