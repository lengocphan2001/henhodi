// API Base Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profile?: {
    fullName?: string;
    avatar?: string;
    address?: string;
  };
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'user' | 'admin';
  profile?: {
    fullName?: string;
    avatar?: string;
    address?: string;
  };
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  phone?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  profile?: {
    fullName?: string;
    avatar?: string;
    address?: string;
  };
}

// Girl Types
export interface Girl {
  _id: string;
  name: string;
  area: string;
  price: string;
  rating: number;
  img: string;
  zalo?: string;
  phone?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  info: {
    'Người đánh': string;
    'ZALO': string;
    'Giá 1 lần': string;
    'Giá phòng': string;
    'Năm sinh': string;
    'Khu vực': string;
    'Chiều cao': string;
    'Cân nặng': string;
    'Số đo': string;
  };
  images?: string[];
  reviews?: Review[];
}

export interface CreateGirlRequest {
  name: string;
  area: string;
  price: string;
  rating: number;
  img: string;
  zalo?: string;
  phone?: string;
  description?: string;
  info: {
    'Người đánh': string;
    'ZALO': string;
    'Giá 1 lần': string;
    'Giá phòng': string;
    'Năm sinh': string;
    'Khu vực': string;
    'Chiều cao': string;
    'Cân nặng': string;
    'Số đo': string;
  };
  images?: string[];
}

export interface UpdateGirlRequest {
  name?: string;
  area?: string;
  price?: string;
  rating?: number;
  img?: string;
  zalo?: string;
  phone?: string;
  description?: string;
  isActive?: boolean;
  info?: Partial<{
    'Người đánh': string;
    'ZALO': string;
    'Giá 1 lần': string;
    'Giá phòng': string;
    'Năm sinh': string;
    'Khu vực': string;
    'Chiều cao': string;
    'Cân nặng': string;
    'Số đo': string;
  }>;
  images?: string[];
}

// Review Types
export interface Review {
  _id: string;
  userId: string;
  girlId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    username: string;
    profile?: {
      fullName?: string;
    };
  };
}

export interface CreateReviewRequest {
  girlId: string;
  rating: number;
  comment: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // User Management Methods
  async getUsers(page = 1, limit = 10, search = ''): Promise<ApiResponse<PaginatedResponse<User>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return this.request<PaginatedResponse<User>>(`/users?${params}`);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleUserStatus(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }

  // Girl Management Methods
  async getGirls(page = 1, limit = 10, search = '', area = ''): Promise<ApiResponse<PaginatedResponse<Girl>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(area && { area }),
    });
    return this.request<PaginatedResponse<Girl>>(`/girls?${params}`);
  }

  async getGirlById(id: string): Promise<ApiResponse<Girl>> {
    return this.request<Girl>(`/girls/${id}`);
  }

  async createGirl(girlData: CreateGirlRequest): Promise<ApiResponse<Girl>> {
    return this.request<Girl>('/girls', {
      method: 'POST',
      body: JSON.stringify(girlData),
    });
  }

  async updateGirl(id: string, girlData: UpdateGirlRequest): Promise<ApiResponse<Girl>> {
    return this.request<Girl>(`/girls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(girlData),
    });
  }

  async deleteGirl(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/girls/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleGirlStatus(id: string): Promise<ApiResponse<Girl>> {
    return this.request<Girl>(`/girls/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }

  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);

    return this.request<{ url: string }>('/upload/image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });
  }

  // Review Methods
  async getReviews(girlId?: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Review>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(girlId && { girlId }),
    });
    return this.request<PaginatedResponse<Review>>(`/reviews?${params}`);
  }

  async createReview(reviewData: CreateReviewRequest): Promise<ApiResponse<Review>> {
    return this.request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<ApiResponse<{
    totalUsers: number;
    totalGirls: number;
    totalReviews: number;
    activeUsers: number;
    activeGirls: number;
    recentUsers: User[];
    recentGirls: Girl[];
  }>> {
    return this.request('/dashboard/stats');
  }

  // Utility Methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}

// Export singleton instance
export const apiService = new ApiService(); 