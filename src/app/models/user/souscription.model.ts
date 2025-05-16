export interface Souscription {
  id: number;
  serviceId: number;
  title: string;
  description: string;
  category: string;
  dateSouscription: Date;
  dateExpiration?: Date;
  status: 'actif' | 'expiré' | 'annulé';
  price: number;
  imageUrl: string;
  expertProfil: string;
  expertName: string;
  averageRating: number;
  reviewsCount: number;
  isFavorite?: boolean;
}