// API Base Configuration
const API_BASE_URL = 'https://blackphuquoc.com/api';

// Debug: Log the API URL being used
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('📡 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

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
  id?: string | number;
  _id?: string | number;
  username: string;
  email: string;
  phone?: string;
  fullName?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  password?: string;
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
  id?: string | number;
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
    'Người đánh giá': string;
    'ZALO': string;
    'Giá 1 lần': string;
    'Giá phòng': string;
    'Năm sinh': string;
    'Khu vực': string;
    'Chiều cao': string;
    'Cân nặng': string;
    'Số đo': string;
  };
  images: string[];
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
    'Người đánh giá': string;
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
    'Người đánh giá': string;
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
  phone?: string;
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 304 Not Modified response
      if (response.status === 304) {
        // For 304 responses, we need to return a success response
        // but the data might be cached, so we'll return an empty success response
        return {
          success: true,
          data: undefined,
          message: 'Data not modified'
        };
      }

      // For other responses, try to parse JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is empty or not JSON, handle gracefully
        if (response.ok) {
          return {
            success: true,
            data: undefined
          };
        } else {
          throw new Error('Invalid response format');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      // Handle different response formats
      if (data.success !== undefined) {
        // Response already has success field
        return data;
      } else {
        // Response doesn't have success field, wrap it
        return {
          success: true,
          data: data
        };
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/users/login', {
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
    return this.request<User>('/users/register', {
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
    return this.request<User>('/users/profile');
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

  async updateUser(user: User): Promise<ApiResponse<User>> {
    const userId = user.id || user._id;
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleUserStatus(userId: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}/toggle-status`, {
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
      // Add cache-busting parameter to prevent 304 responses
      _t: Date.now().toString(),
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
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${this.baseURL}/upload/girl/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async uploadGirlImage(girlId: string, file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${this.baseURL}/girls/${girlId}/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      return data;
    } catch (error) {
      console.error('Upload girl image error:', error);
      return {
        success: false,
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Detail images functions
  async uploadDetailImage(girlId: string, file: File, order?: number): Promise<ApiResponse<{ id: number; url: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (order !== undefined) {
        formData.append('order', order.toString());
      }
      
      const response = await fetch(`${this.baseURL}/girls/${girlId}/detail-images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      return data;
    } catch (error) {
      console.error('Upload detail image error:', error);
      return {
        success: false,
        message: 'Failed to upload detail image',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getDetailImages(girlId: string): Promise<ApiResponse<Array<{
    id: number;
    order: number;
    createdAt: string;
    url: string;
  }>>> {
    try {
      const response = await this.request<Array<{
        id: number;
        order: number;
        createdAt: string;
        url: string;
      }>>(`/girls/${girlId}/detail-images`);
      
      return response;
    } catch (error) {
      console.error('Get detail images error:', error);
      return {
        success: false,
        message: 'Failed to get detail images',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteDetailImage(girlId: string, imageId: number): Promise<ApiResponse<void>> {
    try {
      const response = await this.request<void>(`/girls/${girlId}/detail-images/${imageId}`, {
        method: 'DELETE',
      });
      
      return response;
    } catch (error) {
      console.error('Delete detail image error:', error);
      return {
        success: false,
        message: 'Failed to delete detail image',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateDetailImageOrder(girlId: string, imageId: number, order: number): Promise<ApiResponse<void>> {
    try {
      const response = await this.request<void>(`/girls/${girlId}/detail-images/${imageId}/order`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order }),
      });
      
      return response;
    } catch (error) {
      console.error('Update detail image order error:', error);
      return {
        success: false,
        message: 'Failed to update detail image order',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
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
    return this.request('/users/dashboard/stats');
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