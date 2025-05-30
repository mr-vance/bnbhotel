import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://www.milkandhoneybnb.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Handle CORS or API errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
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