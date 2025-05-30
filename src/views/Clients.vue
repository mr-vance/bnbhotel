<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-row>
        <b-col xl="3" md="6">
          <stats-card
            title="Total Clients"
            type="gradient-red"
            :sub-title="clients.length.toString()"
            icon="ni ni-active-40"
            class="mb-4"
          >
            <template slot="footer">
              <span class="text-success mr-2">0%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <b-button variant="primary" @click="showAddModal = true">New Client</b-button>
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="mt--7">
      <b-row>
        <b-col>
          <div v-if="loading" class="text-center">
            <h4>Loading clients...</h4>
          </div>
          <div v-else-if="error" class="text-center text-danger">
            <h4>Error: {{ error }}</h4>
          </div>
          <light-table v-else :clients="clients" @edit-client="editClient" @delete-client="confirmDelete" />
        </b-col>
      </b-row>
    </b-container>

    <!-- Edit Modal -->
    <b-modal v-model="editModalShow" title="Edit Client" @ok="updateClient" @cancel="resetEditForm">
      <b-form>
        <b-form-group label="First Name" label-for="first_name">
          <b-form-input v-model="editForm.first_name" id="first_name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Last Name" label-for="last_name">
          <b-form-input v-model="editForm.last_name" id="last_name"></b-form-input>
        </b-form-group>
        <b-form-group label="Email" label-for="email_address">
          <b-form-input v-model="editForm.email_address" id="email_address" type="email" required></b-form-input>
        </b-form-group>
        <b-form-group label="Phone" label-for="phone_number">
          <b-form-input v-model="editForm.phone_number" id="phone_number"></b-form-input>
        </b-form-group>
        <b-form-group label="Company" label-for="company_name">
          <b-form-input v-model="editForm.company_name" id="company_name"></b-form-input>
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="secondary" @click="cancel()">Cancel</b-button>
        <b-button size="sm" variant="primary" @click="ok()">Update</b-button>
      </template>
    </b-modal>

    <!-- Add Modal -->
    <b-modal v-model="showAddModal" title="Add New Client" @ok="addClient" @cancel="resetAddForm">
      <b-form>
        <b-form-group label="First Name" label-for="new_first_name">
          <b-form-input v-model="newClient.first_name" id="new_first_name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Last Name" label-for="new_last_name">
          <b-form-input v-model="newClient.last_name" id="new_last_name"></b-form-input>
        </b-form-group>
        <b-form-group label="Email" label-for="new_email_address">
          <b-form-input v-model="newClient.email_address" id="new_email_address" type="email" required></b-form-input>
        </b-form-group>
        <b-form-group label="Phone" label-for="new_phone_number">
          <b-form-input v-model="newClient.phone_number" id="new_phone_number"></b-form-input>
        </b-form-group>
        <b-form-group label="Company" label-for="new_company_name">
          <b-form-input v-model="newClient.company_name" id="new_company_name"></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>

    <!-- Delete Confirmation Modal -->
    <b-modal v-model="deleteModalShow" title="Confirm Delete" @ok="deleteClient">
      <p>Are you sure you want to delete client ID {{ clientToDelete }}?</p>
    </b-modal>

    <!-- Toast Notifications -->
    <b-toast id="success-toast" variant="success" solid>
      <div class="d-flex">
        <b-icon icon="check-circle-fill" class="mr-2"></b-icon>
        <span>Client updated successfully!</span>
      </div>
    </b-toast>
    <b-toast id="error-toast" variant="danger" solid>
      <div class="d-flex">
        <b-icon icon="x-circle-fill" class="mr-2"></b-icon>
        <span>{{ errorMessage || 'Failed to update client. Please try again.' }}</span>
      </div>
    </b-toast>
  </div>
</template>
<script>
import LightTable from '@/views/Tables/RegularTables/LightTable';
import api from '@/api';

export default {
  components: {
    LightTable
  },
  data() {
    return {
      clients: [],
      loading: false,
      error: null,
      errorMessage: null,
      editModalShow: false,
      editForm: {
        client_id: null,
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        company_name: ''
      },
      showAddModal: false,
      newClient: {
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        company_name: ''
      },
      deleteModalShow: false,
      clientToDelete: null
    };
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    async fetchClients() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.getClients();
        this.clients = response.data || [];
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        this.error = 'Failed to load clients. Please try again later.';
        this.clients = [];
      } finally {
        this.loading = false;
      }
    },
    editClient(client) {
      this.editForm = { ...client };
      this.editModalShow = true;
    },
    async updateClient(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.errorMessage = null; // Reset error message
      try {
        const response = await api.updateClient(this.editForm.client_id, {
          first_name: this.editForm.first_name,
          last_name: this.editForm.last_name,
          email_address: this.editForm.email_address,
          phone_number: this.editForm.phone_number,
          company_name: this.editForm.company_name
        });
        if (response.data.message === 'Client updated') {
          await this.fetchClients(); // Refresh the list
          this.$bvToast.show('success-toast');
        } else {
          throw new Error('Unexpected response: ' + JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Failed to update client:', error);
        this.errorMessage = error.response?.data?.error || 'Failed to update client. Please check the server or network.';
        this.$bvToast.show('error-toast');
      }
      this.editModalShow = false;
    },
    resetEditForm() {
      this.editForm = {
        client_id: null,
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        company_name: ''
      };
    },
    confirmDelete(clientId) {
      this.clientToDelete = clientId;
      this.deleteModalShow = true;
    },
    async deleteClient() {
      try {
        await api.deleteClient(this.clientToDelete);
        this.clients = this.clients.filter(c => c.client_id !== this.clientToDelete);
        this.deleteModalShow = false;
      } catch (error) {
        console.error('Failed to delete client:', error);
        this.error = 'Failed to delete client. Please try again.';
      }
    },
    showAddModalFunc() {
      this.showAddModal = true;
    },
    async addClient(bvModalEvt) {
      bvModalEvt.preventDefault();
      try {
        const response = await api.createClient(this.newClient);
        this.clients.push(response.data); // Assuming API returns the new client
        this.showAddModal = false;
        this.resetAddForm();
      } catch (error) {
        console.error('Failed to add client:', error);
        this.error = 'Failed to add client. Please try again.';
      }
    },
    resetAddForm() {
      this.newClient = {
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        company_name: ''
      };
    }
  }
};
</script>