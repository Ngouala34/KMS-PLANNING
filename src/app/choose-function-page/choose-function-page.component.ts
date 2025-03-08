import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-function-page',
  templateUrl: './choose-function-page.component.html',
  styleUrls: ['./choose-function-page.component.scss']
})
export class ChooseFunctionPageComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  OnExpertLogIn(): void {
    this.router.navigateByUrl('expert-login');
  }
  OnUserLogIn(): void {
    this.router.navigateByUrl('user-register');
  }

}
