import axios from 'axios';

class ApiService {
  constructor() {
    this.axios = axios;
  }

  // Método para hacer requests HTTP usando axios
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await this.axios(endpoint, config);
      return response.data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Autenticación - Usando las nuevas rutas de la API
  async login(email, password) {
    return this.request('/api/user/login', {
      method: 'POST',
      data: { email, password },
    });
  }

  async register(userData) {
    return this.request('/api/user/register', {
      method: 'POST',
      data: userData,
    });
  }

  async requestPasswordReset(email) {
    return this.request('/api/user/request-password-reset', {
      method: 'POST',
      data: { email },
    });
  }

  async resetPassword(token, newPassword) {
    return this.request('/api/user/reset-password', {
      method: 'POST',
      data: { token, newPassword },
    });
  }

  // Perfil de usuario
  async getProfile() {
    return this.request('/api/user/profile');
  }

  async updatePassword(currentPassword, newPassword) {
    return this.request('/api/user/update-password', {
      method: 'PUT',
      data: { currentPassword, newPassword },
    });
  }

  async logout() {
    // Limpiar token local
    localStorage.removeItem('auth_token');
    return { success: true };
  }

  // Admin - Gestión de usuarios
  async getUsers() {
    return this.request('/api/user/users');
  }

  async getUserById(id) {
    return this.request(`/api/user/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/api/user/${id}`, {
      method: 'PUT',
      data: userData,
    });
  }

  async deleteUser(id) {
    return this.request(`/api/user/${id}`, {
      method: 'DELETE',
    });
  }

  async activateUser(id) {
    return this.request(`/api/user/${id}/activate`, {
      method: 'PATCH',
    });
  }

  // Dispositivos IoT - Usando las nuevas rutas
  async createDevice(deviceData) {
    return this.request('/api/device/create-device', {
      method: 'POST',
      data: deviceData,
    });
  }

  async getDevices(token) {
    return this.request('/api/device/device-list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateDevice(id, deviceData) {
    return this.request(`/api/device/update-device/${id}`, {
      method: 'PUT',
      data: deviceData,
    });
  }

  async deleteDevice(id) {
    return this.request(`/api/device/delete-device/${id}`, {
      method: 'DELETE',
    });
  }

  async getDeviceById(id) {
    return this.request(`/api/device/${id}`);
  }

  async getDeviceData(id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/device/${id}/data${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  // Métricas y estadísticas
  async getMetrics() {
    return this.request('/api/metrics');
  }

  async getDeviceMetrics(deviceId) {
    return this.request(`/api/device/${deviceId}/metrics`);
  }
}

// Instancia singleton
export const apiService = new ApiService();
export default apiService;
