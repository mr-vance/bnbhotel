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
          <light-table
            v-else
            :clients="clients"
            @edit-client="editClient"
            @view-client="viewClient"
          />
        </b-col>
      </b-row>
    </b-container>

    <!-- View Modal -->
    <b-modal v-model="viewModalShow" title="Client Details">
      <div v-if="selectedClient">
        <p><strong>First Name:</strong> {{ selectedClient.first_name || 'Not provided' }}</p>
        <p><strong>Last Name:</strong> {{ selectedClient.last_name || 'Not provided' }}</p>
        <p><strong>Email:</strong> {{ selectedClient.email_address || 'Not provided' }}</p>
        <p><strong>Phone:</strong> {{ selectedClient.phone_number || 'Not provided' }}</p>
        <p><strong>Company Name:</strong> {{ selectedClient.company_name || 'Not provided' }}</p>
        <p><strong>Company Address:</strong> {{ selectedClient.company_address || 'Not provided' }}</p>
        <p><strong>Company VAT Number:</strong> {{ selectedClient.company_vat_number || 'Not provided' }}</p>
        <p><strong>Company Website:</strong> {{ selectedClient.company_website || 'Not provided' }}</p>
        <p><strong>Created At:</strong> {{ selectedClient.created_at || 'Not provided' }}</p>
        <p><strong>Last Modified:</strong> {{ selectedClient.last_modified || 'Not provided' }}</p>
      </div>
      <template v-slot:modal-footer="{ cancel }">
        <b-button size="sm" variant="danger" @click="confirmDelete">Delete</b-button>
        <b-button size="sm" variant="secondary" @click="cancel()">Close</b-button>
      </template>
    </b-modal>

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
        <b-form-group label="Company Name" label-for="company_name">
          <b-form-input v-model="editForm.company_name" id="company_name"></b-form-input>
        </b-form-group>
        <b-form-group label="Company Address" label-for="company_address">
          <b-form-input v-model="editForm.company_address" id="company_address"></b-form-input>
        </b-form-group>
        <b-form-group label="Company VAT Number" label-for="company_vat_number">
          <b-form-input v-model="editForm.company_vat_number" id="company_vat_number"></b-form-input>
        </b-form-group>
        <b-form-group label="Company Website" label-for="company_website">
          <b-form-input v-model="editForm.company_website" id="company_website"></b-form-input>
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
        <b-form-group label="Company Name" label-for="new_company_name">
          <b-form-input v-model="newClient.company_name" id="new_company_name"></b-form-input>
        </b-form-group>
        <b-form-group label="Company Address" label-for="new_company_address">
          <b-form-input v-model="newClient.company_address" id="new_company_address"></b-form-input>
        </b-form-group>
        <b-form-group label="Company VAT Number" label-for="new_company_vat_number">
          <b-form-input v-model="newClient.company_vat_number" id="new_company_vat_number"></b-form-input>
        </b-form-group>
        <b-form-group label="Company Website" label-for="new_company_website">
          <b-form-input v-model="newClient.company_website" id="new_company_website"></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>

    <!-- Delete Confirmation Modal -->
    <b-modal v-model="deleteModalShow" title="Confirm Delete" @ok="deleteClient">
      <p>Are you sure you want to delete this client?</p>
    </b-modal>

    <!-- Edit Error Modal -->
    <b-modal v-model="editErrorModalShow" title="Edit Error" ok-only ok-title="OK">
      <p class="text-danger">{{ editErrorMessage || 'An error occurred while updating the client.' }}</p>
    </b-modal>

    <!-- Add Error Modal -->
    <b-modal v-model="addErrorModalShow" title="Add Error" ok-only ok-title="OK">
      <p class="text-danger">{{ addErrorMessage || 'An error occurred while adding the client.' }}</p>
    </b-modal>

    <!-- Edit Success Modal -->
    <b-modal v-model="editSuccessModalShow" title="Update Successful" ok-only ok-title="OK">
      <div class="d-flex align-items-center">
        <b-icon icon="check-circle-fill" variant="success" class="mr-2"></b-icon>
        <p class="mb-0">Client updated successfully!</p>
      </div>
    </b-modal>

    <!-- Add Success Modal -->
    <b-modal v-model="addSuccessModalShow" title="New Client Added" ok-only ok-title="OK">
      <div class="d-flex align-items-center">
        <b-icon icon="check-circle-fill" variant="success" class="mr-2"></b-icon>
        <p class="mb-0">New client added successfully!</p>
      </div>
    </b-modal>
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
      editErrorModalShow: false,
      editErrorMessage: null,
      addErrorModalShow: false,
      addErrorMessage: null,
      editSuccessModalShow: false,
      addSuccessModalShow: false,
      viewModalShow: false,
      selectedClient: null,
      editModalShow: false,
      editForm: {
        client_id: null,
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        company_name: '',
        company_address: '',
        company_vat_number: '',
        company_website: ''
      },
      showAddModal: false,
      newClient: {
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        company_name: '',
        company_address: '',
        company_vat_number: '',
        company_website: ''
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
    viewClient(client) {
      this.selectedClient = client;
      this.viewModalShow = true;
    },
    editClient(client) {
      this.editForm = { ...client };
      this.editModalShow = true;
    },
    async updateClient(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.editErrorMessage = null;
      this.editSuccessModalShow = false;
      try {
        const response = await api.updateClient(this.editForm.client_id, {
          first_name: this.editForm.first_name,
          last_name: this.editForm.last_name,
          email_address: this.editForm.email_address,
          phone_number: this.editForm.phone_number,
          company_name: this.editForm.company_name,
          company_address: this.editForm.company_address,
          company_vat_number: this.editForm.company_vat_number,
          company_website: this.editForm.company_website
        });
        if (response.data.message === 'Client updated') {
          await this.fetchClients();
          this.editSuccessModalShow = true;
          setTimeout(() => {
            this.editSuccessModalShow = false;
          }, 2000);
        } else {
          throw new Error('Unexpected response: ' + JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Failed to update client:', error);
        this.editErrorMessage = error.message || 'Failed to update client. Please check the server or network.';
        this.editErrorModalShow = true;
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
        company_name: '',
        company_address: '',
        company_vat_number: '',
        company_website: ''
      };
    },
    confirmDelete() {
      if (this.selectedClient) {
        this.clientToDelete = this.selectedClient.client_id;
      }
      this.viewModalShow = false;
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
    async addClient(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.addErrorMessage = null;
      this.addSuccessModalShow = false;
      try {
        const response = await api.createClient(this.newClient);
        if (response.data.message === 'Client created') {
          const newClient = {
            client_id: response.data.client_id,
            first_name: this.newClient.first_name,
            last_name: this.newClient.last_name,
            email_address: this.newClient.email_address,
            phone_number: this.newClient.phone_number,
            company_name: this.newClient.company_name,
            company_address: this.newClient.company_address,
            company_vat_number: this.newClient.company_vat_number,
            company_website: this.newClient.company_website
          };
          this.clients.push(newClient);
          this.addSuccessModalShow = true;
          setTimeout(() => {
            this.addSuccessModalShow = false;
          }, 2000);
        } else {
          throw new Error('Unexpected response: ' + JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Failed to add client:', error);
        this.addErrorMessage = error.message || 'Failed to add client. Please check the server or network.';
        this.addErrorModalShow = true;
      }
      this.showAddModal = false;
    },
    resetAddForm() {
      this.newClient = {
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        company_name: '',
        company_address: '',
        company_vat_number: '',
        company_website: ''
      };
    }
  }
};
</script>