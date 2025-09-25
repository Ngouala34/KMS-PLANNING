
//Interface user register
export interface IUserRegister {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

//Interface réponse auth
export interface IAuthResponse {
    access: string;
    refresh: string;
    user?: {
        id: number;
        name: string;
        email: string;
        user_type: string;
    };
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  user_type: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
  domain?: string;
  profil_image: string
  // Ajoute d'autres champs selon ton API
}

export interface UserStats {
  upcomingAppointments: number;
  completedFormations: number;
  souscriptions: number;
  favoris: number;
  engagementRate?: number;
}

export interface DashboardAppointment {
  id: string;
  title: string;
  expert: string;
  time: string;
  date: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  type: 'consultation' | 'formation';
  imageUrl?: string;
}

export interface SocialLoginRequest {
    access_token: string;
    code: string;
    id_token: string;
  };

export interface SocialLoginResponse {
  access_token: string;
  code: string;
  id_token: string;
}

// Interface pour la réponse de votre backend
export interface IAuthResponse {
  access: string;    // Token d'accès
  refresh: string;   // Token de rafraîchissement
}