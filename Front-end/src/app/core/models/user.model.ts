export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    password: string;
    role: string;
    is_active: boolean;
    created_at: string;
    how_found_us?: string;
  }