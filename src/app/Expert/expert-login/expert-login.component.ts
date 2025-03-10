import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expert-login',
  templateUrl: './expert-login.component.html',
  styleUrls: ['./expert-login.component.scss']
})
export class ExpertLoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onConnexion(): void {
    this.router.navigateByUrl('dashboard-expert');
  }
}
