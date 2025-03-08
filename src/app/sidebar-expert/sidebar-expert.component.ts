import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-expert',
  templateUrl: './sidebar-expert.component.html',
  styleUrls: ['./sidebar-expert.component.scss']
})
export class SidebarExpertComponent implements OnInit {

  isSidebarCollapsed = false;
  constructor() { }

  ngOnInit(): void {
  }

}
