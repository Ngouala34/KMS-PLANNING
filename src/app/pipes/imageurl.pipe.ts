import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {
  private baseUrl = 'https://vps-ecacc737.vps.ovh.net/rendez_vous/media/'; 

  transform(path: string | null | undefined): string {
    if (!path) {
      return '/assets/images/default-service.jpg'; // image par défaut
    }

    // Si c’est déjà une URL absolue, on la renvoie telle quelle
    if (path.startsWith('http')) {
      return path;
    }

    return `${this.baseUrl}${path}`;
  }
}
