import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  toggleMenuVisible = false;


  constructor() { }

  ngOnInit(): void {
  }


  toggleMenu() {
    this.toggleMenuVisible = !this.toggleMenuVisible;
  }

}



