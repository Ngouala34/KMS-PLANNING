export interface Favoris {
  id: number;
  serviceId: number;
  title: string;
  description: string;
  category: string;
  dateAdded: Date;
  price: number;
  imageUrl: string;
  expertProfil: string;
  expertName: string;
  averageRating: number;
  reviewsCount: number;
  isFavorite: boolean; // Toujours true pour les favoris
}