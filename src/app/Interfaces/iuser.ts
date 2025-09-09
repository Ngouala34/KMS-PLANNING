
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
