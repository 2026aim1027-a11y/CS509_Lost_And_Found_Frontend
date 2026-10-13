export type UserRole = "admin" | "user";

/**
 * A portal user.
 *
 * `/auth/login/` returns only the identity fields (id, email, full_name,
 * registration_number, role, is_staff); `/users/me/` returns the full profile.
 * Everything beyond the identity fields is therefore optional.
 */
export interface User {
  id: string;
  email: string;
  registration_number: string;
  full_name: string;
  role: UserRole;
  is_staff: boolean;
  department?: string;
  program_year?: string;
  hostel?: string;
  phone?: string;
  photo?: string | null;
  date_joined?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

/** `POST /auth/login/` */
export interface LoginResponse extends AuthTokens {
  user: User;
}

/** `GET | PATCH /users/me/` */
export interface ProfileResponse {
  success: boolean;
  message?: string;
  data: Omit<User, "role"> & { role?: UserRole };
}

/** `POST /auth/request-otp/`; `debug_otp` is only present when the backend runs with DEBUG=True. */
export interface OtpResponse {
  success: boolean;
  message: string;
  debug_otp?: string;
}

/** Generic `{ success, message }` envelope used by the remaining auth endpoints. */
export interface MessageResponse {
  success: boolean;
  message: string;
}

export type OtpPurpose = "registration" | "password_reset";

/** Body of `POST /auth/register/`. */
export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  registration_number: string;
  department: string;
  program_year: string;
  hostel: string;
  phone: string;
}

/** Editable fields accepted by `PATCH /users/me/`. */
export interface ProfileUpdate {
  full_name: string;
  department: string;
  program_year: string;
  hostel: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  access?: string;
  refresh?: string;
  errors?: Record<string, string[]>;
}
