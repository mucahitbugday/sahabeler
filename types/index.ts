// User Role Types
export type UserRole = 'user' | 'editor' | 'admin' | 'moderator' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  sahabeId: string;
  sahabeName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFavorite {
  id: string;
  userId: string;
  sahabeId: string;
  sahabeName: string;
  sahabeImageUrl: string;
  createdAt: string;
}

// Sahabe (Companion) Types
export interface Sahabe {
  id: string;
  slug: string;
  name: string;
  arabicName: string;
  title: string;
  description: string;
  imageUrl: string;
  birthYear: number;
  birthPlace: string;
  deathYear: number;
  deathPlace: string;
  burialPlace: string;
  generation: string;
  nickname: string;
  biography: string;
  fullBiography?: BiographySection[];
  events: Event[];
  relations: Relation[];
  hadiths: Hadith[];
}

export interface BiographySection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface SahabeCard {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  title?: string;
}

// Event Types
export interface Event {
  id: string;
  slug: string;
  title: string;
  year: number;
  description: string;
  imageUrl: string;
  fullDescription?: string;
  participants?: string[];
}

// Relation Types
export interface Relation {
  id: string;
  name: string;
  relationship: string;
  imageUrl: string;
  children?: string[];
  slug?: string;
}

// Hadith Types
export interface Hadith {
  id: string;
  text: string;
  source: string;
  narrator: string;
  grade?: string;
  topic?: string;
}

// Generation Types
export interface Generation {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description?: string;
  imageUrl: string;
  sahabelerCount?: number;
}

// Edit Request Types (for editors)
export interface EditRequest {
  id: string;
  userId: string;
  userName: string;
  sahabeId: string;
  sahabeName: string;
  type: 'add' | 'edit';
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Search Types
export interface SearchSuggestion {
  id: string;
  slug: string;
  name: string;
  type: 'sahabe' | 'event' | 'generation';
  imageUrl?: string;
}
