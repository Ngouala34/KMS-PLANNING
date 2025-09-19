import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-expert',
  templateUrl: './main-expert.component.html',
  styleUrls: ['./main-expert.component.scss']
})
export class MainExpertComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {  
  }
    isSidebarCollapsed = false;
  

  onSidebarToggle(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }
}
