import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-expert',
  templateUrl: './header-expert.component.html',
  styleUrls: ['./header-expert.component.scss']
})
export class HeaderExpertComponent implements OnInit {
  menuOpen = false;
  toggleMenuVisible = false;


  constructor() { }

  ngOnInit(): void {
  }


  toggleMenu() {
    this.toggleMenuVisible = !this.toggleMenuVisible;
  }

}



