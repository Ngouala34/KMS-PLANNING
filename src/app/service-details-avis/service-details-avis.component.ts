import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-details-avis',
  templateUrl: './service-details-avis.component.html',
  styleUrls: ['./service-details-avis.component.scss']
})
export class ServiceDetailsAvisComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

 // Variables pour le système d'avis
 userRating = 0;
 tempRating = 0;
 userComment = '';
 isSubmitting = false;
 showSuccess = false;

 // Exemple d'avis existants
 reviews = [
   { id: 1, author: 'Marie D.', rating: 5, comment: 'Il fait partie des meilleurs dans son domaine j\'ai eu la chance de travailler avec lui sur différentes formations. je vous l\'assure j\'ai toujours été emerveillé par le talent de cet homme. Ses services exceptionnels, je vous le recommande !', date: '2023-11-15' },
   { id: 2, author: 'Pierre L.', rating: 4, comment: 'Très bon service mais un peu long', date: '2023-10-28' }
 ];

 setRating(rating: number): void {
   this.userRating = rating;
 }

 setTempRating(rating: number): void {
   this.tempRating = rating;
 }

 resetTempRating(): void {
   this.tempRating = this.userRating;
 }

 submitReview(): void {
   if (this.userRating < 1 || !this.userComment.trim()) return;

   this.isSubmitting = true;



     this.userRating = 0;
     this.tempRating = 0;
     this.userComment = '';
     this.isSubmitting = false;
     this.showSuccess = true;

     setTimeout(() => this.showSuccess = false, 3000);
   };
 }
  

