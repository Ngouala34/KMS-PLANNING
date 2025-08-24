import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-iframe',
  templateUrl: './map-iframe.component.html',
  styleUrls: ['./map-iframe.component.scss']
})
export class MapIframeComponent implements OnInit {
  
  // URL iframe de Google Maps (à remplacer par votre propre iframe)
  mapIframeUrl: string = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.947007429321!2d9.767879!3d4.0511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDMnMDQuMCJOIDnCsDQ2JzA0LjQiRQ!5e0!3m2!1sfr!2scm!4v1640000000000!5m2!1sfr!2scm`;
  
  // Coordonnées pour les liens (à adapter)
  latitude: number = 4.0511;
  longitude: number = 9.7679;
  placeName: string = 'KMS Planning Douala';

  constructor() { }

  ngOnInit(): void {
  }

  // Ouvrir dans Google Maps
  openInGoogleMaps(): void {
    const url = `https://www.google.com/maps/search/?api=1&query=${this.latitude},${this.longitude}&query_place_id=${encodeURIComponent(this.placeName)}`;
    window.open(url, '_blank');
  }

  // Obtenir l'itinéraire
  getDirections(): void {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${this.latitude},${this.longitude}&destination_place_id=${encodeURIComponent(this.placeName)}`;
    window.open(url, '_blank');
  }

  // Ouvrir dans Apple Plans (pour iOS)
  openInAppleMaps(): void {
    const url = `https://maps.apple.com/?q=${this.latitude},${this.longitude}&name=${encodeURIComponent(this.placeName)}`;
    window.open(url, '_blank');
  }
}