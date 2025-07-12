const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API] Attaching JWT token to request:', token);
    } else {
      console.warn('[API] No JWT token found in localStorage when making request to', endpoint);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async login(credentials) {
    return this.post('/api/auth/login', credentials);
  }

  async register(userData) {
    return this.post('/api/auth/register', userData);
  }

  async getCurrentUser() {
    return this.get('/api/auth/me');
  }

  async syncFirebaseUser(firebaseUser) {
    return this.post('/api/auth/firebase-sync', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    });
  }

  // Items endpoints
  async getItems(params = {}) {
    return this.get('/api/items', params);
  }

  async getItem(id) {
    return this.get(`/api/items/${id}`);
  }

  async createItem(itemData) {
    return this.post('/api/items', itemData);
  }

  async updateItem(id, itemData) {
    return this.put(`/api/items/${id}`, itemData);
  }

  async deleteItem(id) {
    return this.delete(`/api/items/${id}`);
  }

  async requestSwap(itemId, message) {
    return this.post(`/api/items/${itemId}/swap-request`, { message });
  }

  async submitSwapRequest(swapRequestData) {
    return this.post('/api/swaps/submit-request', swapRequestData);
  }

  // User endpoints
  async getUserProfile() {
    return this.get('/api/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.put('/api/users/profile', profileData);
  }

  // Points endpoints
  async getPointsSummary() {
    return this.get('/api/points/summary');
  }

  async getPointsHistory(period = 'all') {
    return this.get(`/api/points/history?period=${period}`);
  }

  async earnPoints(amount, description, category) {
    return this.post('/api/points/earn', { amount, description, category });
  }

  async spendPoints(amount, description, category) {
    return this.post('/api/points/spend', { amount, description, category });
  }

  async getEarningOpportunities() {
    return this.get('/api/points/opportunities');
  }

  async getRewards() {
    return this.get('/api/points/rewards');
  }

  async purchaseReward(rewardId) {
    return this.post(`/api/points/rewards/${rewardId}/purchase`);
  }

  async completeAction(actionId) {
    return this.post(`/api/points/actions/${actionId}/complete`);
  }

  async getUserItems() {
    return this.get('/api/items/user/me');
  }

  // Swap endpoints
  async getSwapRequests() {
    return this.get('/api/swaps/my-requests');
  }

  async getIncomingRequests() {
    return this.get('/api/swaps/incoming');
  }

  async acceptSwapRequest(itemId, userId) {
    return this.put(`/api/swaps/accept/${itemId}/${userId}`);
  }

  async declineSwapRequest(itemId, userId) {
    return this.put(`/api/swaps/decline/${itemId}/${userId}`);
  }

  async completeSwap(swapData) {
    return this.post('/api/swaps/complete', swapData);
  }

  // Swap chat endpoints
  async getSwapChat(swapId) {
    return this.get(`/api/swaps/${swapId}/chat`);
  }

  async sendSwapMessage(swapId, message) {
    return this.post(`/api/swaps/${swapId}/messages`, { message });
  }

  async updateSwapStatus(swapId, status) {
    return this.put(`/api/swaps/${swapId}/status`, { status });
  }

  // Real-time data helpers
  async getRealTimeItems(params = {}) {
    try {
      const response = await this.getItems(params);
      return response.items || [];
    } catch (error) {
      console.log('Using fallback data - API not available');
      return [];
    }
  }

  async getRealTimeUserItems() {
    try {
      const response = await this.getUserItems();
      return response.items || [];
    } catch (error) {
      console.log('Using fallback data - API not available');
      return [];
    }
  }

  async getRealTimeSwapRequests() {
    try {
      const response = await this.getSwapRequests();
      return response.requests || [];
    } catch (error) {
      console.log('Using fallback data - API not available');
      return [];
    }
  }

  async getRealTimeIncomingRequests() {
    try {
      const response = await this.getIncomingRequests();
      return response.requests || [];
    } catch (error) {
      console.log('Using fallback data - API not available');
      return [];
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 