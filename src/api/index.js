import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create Axios instance
const apiClient = axios.create({
  baseURL: '/api', // Relative path for proxy
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Configure axios-retry for automatic retries
axiosRetry(apiClient, {
  retries: 3, // Retry up to 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Exponential backoff: 1s, 2s, 3s
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response && error.response.status >= 500);
  }
});

// Handle CORS or API errors with detailed messages
apiClient.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Network error: Unable to reach the server. Please check your connection or server status.';
    } else {
      errorMessage = `Request error: ${error.message}`;
    }
    console.error('API Error:', errorMessage, error);
    return Promise.reject(new Error(errorMessage));
  }
);

export default {
  // Clients
  getClients() {
    return apiClient.get('/clients.php');
  },
  getClient(id) {
    return apiClient.get(`/clients.php?id=${id}`);
  },
  createClient(data) {
    return apiClient.post('/clients.php', data);
  },
  updateClient(id, data) {
    return apiClient.put(`/clients.php?id=${id}`, data);
  },
  deleteClient(id) {
    return apiClient.delete(`/clients.php?id=${id}`);
  },

  // Quotes
  getQuotes() {
    return apiClient.get('/quotes.php');
  },
  createQuote(data) {
    return apiClient.post('/quotes.php', data);
  },
  updateQuote(id, data) {
    return apiClient.put(`/quotes.php?id=${id}`, data);
  },
  deleteQuote(id) {
    return apiClient.delete(`/quotes.php?id=${id}`);
  },

  // Invoices
  getInvoices() {
    return apiClient.get('/invoices.php');
  },
  createInvoice(data) {
    return apiClient.post('/invoices.php', data);
  },
  updateInvoice(id, data) {
    return apiClient.put(`/invoices.php?id=${id}`, data);
  },
  deleteInvoice(id) {
    return apiClient.delete(`/invoices.php?id=${id}`);
  }
};