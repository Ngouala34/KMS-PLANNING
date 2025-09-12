export interface Category {
  code: string;
  name: string;
}

export interface Subcategory {
  code: string;
  name: string;
}

export interface Subsubcategory {
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
  date: string[];
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