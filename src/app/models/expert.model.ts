export interface Expert {
  id?: string;
  name: string;
  email: string;
  password: string;
  domaine: string;
  specialties?: string[];
  experience?: number;
  description?: string;
  hourlyRate?: number;
  availability?: Availability;
  profileImage?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Availability {
  days: string[];
  hours: {
    start: string;
    end: string;
  };
  timezone: string;
}

export interface RegisterExpertRequest {
  name: string;
  email: string;
  password: string;
  domaine: string;
  confirmPassword: string;
  terms: boolean;
}

export interface RegisterExpertResponse {
  success: boolean;
  message: string;
  expert?: Expert;
  token?: string;
}