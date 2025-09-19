export interface IExpertRegister {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
    domain: string;
    terms: boolean;
}

export interface IExpertResponse {
    success: boolean;
    message: string;
    expert?: {
        id: number;
        name: string;
        email: string;
        domaine: string;
        // autres champs pertinents
    };
    token?: string;
}

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

export interface IExpertNotifications {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    notif_type: "service" | "reservation"| "reminder" | "general" // Type de notification (info, warning, alert, etc.)
    user: number; // ID de l'utilisateur
    created_at: string; // Date de création
}
