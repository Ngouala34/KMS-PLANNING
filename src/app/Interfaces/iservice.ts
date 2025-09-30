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
  average_rating: number,
  reviews_count: number,
  domain: string
}

export interface IService {
  id: number;
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  preferred_platform: string;
  price: number;
  duration: number;
  cover_image: string;
  cover_image_url: string;
  effective_duration: number;
  category: string;
  subcategory: Subcategory;
  subsubcategory: Subsubcategory;
  category_display: string;
  meeting_link: string ;
  subscription: string;
  expert: Expert;
  average_rating: number,
  reviews_count: number

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
  reservation_id: number;
  payment_id: number;
  tx_ref: string;
  payment_link: string;
}

export interface IBooking {
  date: string;          
  start_time: string;      
  end_time: string;  
  duration: number;       
  total_price: string;     
  platform?: 'google_meet' | 'zoom'; 
  meeting_link?: string | null;     
}


export interface IBookingResponse {
  id: number;
  service : {
    id: string ; 
    name: string;
    date: string;
    cover_image_url: string | null;
    start_time: string; 
    end_time: string;
    preferred_platform: 'google_meet' | 'zoom';
    meeting_link?: string | null;
    description: string;
    price: number;
    category: string;
    cover_image: string;
    subcategory: string;
    subsubcategory:string;
    average_rating: number;
    isFavorite: boolean

  }
    created_at: string;
    updated_at: string;
    status: 'available' | 'reserved' | 'completed' | 'cancelled';
    reservations_count: number

  expert : {
    id: number; 
    name: string;
    profile_picture: string ;
    user_type: string;
    domain: string;
    email: string;
    reviews_count: number
  }
}


export interface INotification {
  id: number;
  title: string;
  message: string;
  notif_type: 'service' | 'reservation' | 'reminder' | 'general';
  is_read: boolean;
  created_at: string;
  user: number;
}

