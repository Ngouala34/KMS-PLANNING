import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}


  avis = {
    avatar: 'https://i.pinimg.com/736x/a8/ba/96/a8ba9626de3fadff0b38e1c83cdea435.jpg',
    nom: 'Rehan',
    role: 'Formateur en développement web',
    note: '★★★★★',
    moyenne: 4.8,
  };

  details = {
    title: 'Formation en developpement web et optimisation SEO',
    description: 'Lorem ipsumc ieuholor sit amet, consectetur adipiscing elit Lorem ipsumc ieuholor sit amet, consectetur adipiscing elit Lorem ipsumc ieuholor sit amet, consectetur adipiscing elit Lorem ipsumc ieuholor sit amet, consectetur adipiscing elit.',
    price: 455,
    date: '02/02/2025',
    startTime: '10:00',
    endTime: '12:00',
    platform: 'Google Meet'
  };


}
