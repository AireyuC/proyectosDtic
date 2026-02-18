export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    groups: string[];
}

export interface AuthResponse {
    token: string;
    user: User;
}
