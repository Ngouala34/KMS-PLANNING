export interface Category {
  value: string;
  code: string;
  name: string;
}

export interface Subcategory {
  value: any;
  code: string;
  name: string;
}

export interface Subsubcategory {
  value: any;
  code: string;
  name: string;
}

export interface ExpertProfile {
  id: number;
  expert_name: string;
  expert_description: string;
  expert_photo: string | null;
  expert_rating: number | null;
  expert_specialty: string | null;
  expert_experience: string | null;
  expert_qualifications: string | null;
  expert_languages: string | null;
  expert_availability: string | null;
  expert_location: string | null;
}

export interface Expert {
  id: number;
  name: string;
  email: string;
  expert_profile: ExpertProfile | null;
}

export interface IService {
  id: number;
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  preferred_platform: string;
  price: string;
  duration: number;
  cover_image: string;
  effective_duration: number;
  category: Category;
  subcategory: Subcategory;
  subsubcategory: Subsubcategory;
  category_display: string;
  meeting_link: string | null;
  subscription: string;
  expert: Expert;

  // Propriétés pour la compatibilité avec l'ancien code
  title?: string;
  imageUrl?: string;
  expertProfil?: string;
  expertName?: string;
  avarage: number;
  reviews?: number;
  isFavorite?: boolean;
}


export interface ICommentResponse {
  id: number;
  user:number
  user_name: string; // Nom de l'utilisateur
  service: number; // ID du service
  service_name: string; // Nom du service
  content: string;
  created_at: string; // Date de création
}

export interface IRatingResponse {
  id: number;
  service: number; // ID du service
  score: number; // Note moyenne
  user:number; // ID de l'utilisateur qui a noté
  created_at: string; // Date de création
  average_rating: number; // Note moyenne calculée
}

export interface ISubscritionResponse {
  id: number;
  client: number; // ID de l'utilisateur
  service: number; // ID du service
  expert: number; // ID de l'expert
  expert_name: string; // Nom de l'expert
  created_at: string; // Date de création
}

export interface IBooking {
  date: string;          
  start_time: string;      
  end_time: string;       
  platform?: 'google_meet' | 'zoom'; 
  meeting_link?: string | null;     
}


export interface IBookingResponse {
  id: number;
  service_name: string;
  expert_name: string;
  client_name: string;

  date: string;
  start_time: string;
  end_time: string;

  duration: number;

  platform?: 'google_meet' | 'zoom';
  meeting_link?: string | null;

  total_price: string;
  status: 'available' | 'booked' | 'completed' | 'canceled';

  created_at: string;
  updated_at: string;
}
