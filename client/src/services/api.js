const API_BASE = '/api';

export const api = {
  // Dashboard statistics
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/requests/stats/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // Donors
  async getDonors(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/donors?${query}`);
    if (!res.ok) throw new Error('Failed to fetch donors');
    return res.json();
  },

  async registerDonor(donorData) {
    const res = await fetch(`${API_BASE}/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to register donor');
    return data;
  },

  async toggleDonorAvailability(id) {
    const res = await fetch(`${API_BASE}/donors/${id}/availability`, {
      method: 'PATCH'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle availability');
    return data;
  },

  async deleteDonor(id) {
    const res = await fetch(`${API_BASE}/donors/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete donor');
    return data;
  },

  async getCompatibleDonors(bloodGroup, city = '') {
    const query = new URLSearchParams({ bloodGroup, city }).toString();
    const res = await fetch(`${API_BASE}/donors/compatible?${query}`);
    if (!res.ok) throw new Error('Failed to fetch compatible donors');
    return res.json();
  },

  // Blood Requests
  async getRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/requests?${query}`);
    if (!res.ok) throw new Error('Failed to fetch blood requests');
    return res.json();
  },

  async createRequest(requestData) {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit request');
    return data;
  },

  async updateRequestStatus(id, status) {
    const res = await fetch(`${API_BASE}/requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update request status');
    return data;
  },

  async deleteRequest(id) {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete request');
    return data;
  }
};

