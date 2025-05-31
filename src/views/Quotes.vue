<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-row>
        <b-col xl="3" md="6">
          <stats-card
            title="Total Quotes"
            type="gradient-red"
            :sub-title="quotes.length.toString()"
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
          <b-button variant="primary" @click="showAddModal = true">New Quote</b-button>
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="mt--7">
      <b-row>
        <b-col>
          <div v-if="loading" class="text-center">
            <h4>Loading quotes...</h4>
          </div>
          <div v-else-if="error" class="text-center text-danger">
            <h4>Error: {{ error }}</h4>
          </div>
          <light-quotes-table
            v-else
            :quotes="quotes"
            @view-quote="viewQuote"
          />
        </b-col>
      </b-row>
    </b-container>

    <!-- View Modal -->
    <b-modal v-model="viewModalShow" title="Quote Details">
      <div v-if="selectedQuote">
        <p><strong>Client:</strong> {{ getClientName(selectedQuote.client_id) || 'Not provided' }}</p>
        <p><strong>Quote Number:</strong> {{ selectedQuote.quote_number ? 'QUOTATION ' + selectedQuote.quote_number : 'Not provided' }}</p>
        <p><strong>Number of Beds:</strong> {{ selectedQuote.number_of_beds || 'Not provided' }}</p>
        <p><strong>Number of Guests:</strong> {{ selectedQuote.number_of_guests || 'Not provided' }}</p>
        <p><strong>Unit Bed Cost:</strong> {{ formatCurrency(selectedQuote.unit_bed_cost) || 'Not provided' }}</p>
        <p><strong>Unit Breakfast Cost:</strong> {{ formatCurrency(selectedQuote.unit_breakfast_cost) || 'Not provided' }}</p>
        <p><strong>Unit Lunch Cost:</strong> {{ formatCurrency(selectedQuote.unit_lunch_cost) || 'Not provided' }}</p>
        <p><strong>Unit Dinner Cost:</strong> {{ formatCurrency(selectedQuote.unit_dinner_cost) || 'Not provided' }}</p>
        <p><strong>Guest Details:</strong> {{ selectedQuote.guest_details || 'Not provided' }}</p>
        <p><strong>Check-in Date:</strong> {{ selectedQuote.check_in_date || 'Not provided' }}</p>
        <p><strong>Check-out Date:</strong> {{ selectedQuote.check_out_date || 'Not provided' }}</p>
        <p><strong>Breakfast Dates:</strong> {{ selectedQuote.breakfast_dates ? JSON.stringify(selectedQuote.breakfast_dates) : 'Not provided' }}</p>
        <p><strong>Lunch Dates:</strong> {{ selectedQuote.lunch_dates ? JSON.stringify(selectedQuote.lunch_dates) : 'Not provided' }}</p>
        <p><strong>Dinner Dates:</strong> {{ selectedQuote.dinner_dates ? JSON.stringify(selectedQuote.dinner_dates) : 'Not provided' }}</p>
        <p><strong>Discount Percentage:</strong> {{ selectedQuote.discount_percentage || 'Not provided' }}%</p>
        <p><strong>Subtotal:</strong> {{ formatCurrency(selectedQuote.subtotal) || 'Not provided' }}</p>
        <p><strong>VAT:</strong> {{ formatCurrency(selectedQuote.vat) || 'Not provided' }}</p>
        <p><strong>Total:</strong> {{ formatCurrency(selectedQuote.total) || 'Not provided' }}</p>
        <p><strong>Document Type:</strong> {{ selectedQuote.document_type || 'Not provided' }}</p>
        <p><strong>Status:</strong> {{ selectedQuote.invoice_status === 'invoiced' ? 'Paid' : 'Unpaid' }}</p>
        <p><strong>Created At:</strong> {{ selectedQuote.created_at || 'Not provided' }}</p>
        <p><strong>Last Modified:</strong> {{ selectedQuote.last_modified || 'Not provided' }}</p>
      </div>
      <template v-slot:modal-footer="{ cancel }">
        <b-button size="sm" variant="danger" @click="confirmDelete">Delete</b-button>
        <b-button size="sm" variant="info" @click="editQuote">Edit</b-button>
        <b-button size="sm" variant="secondary" @click="cancel()">Close</b-button>
      </template>
    </b-modal>

    <!-- Edit Modal -->
    <b-modal v-model="editModalShow" title="Edit Quote" @ok="updateQuote" @cancel="resetEditForm">
      <b-form>
        <b-form-group label="Client" label-for="client_id">
          <b-form-select v-model="editForm.client_id" id="client_id" :options="clientOptions" required></b-form-select>
        </b-form-group>
        <b-form-group label="Quote Number" label-for="quote_number">
          <b-form-input v-model="editForm.quote_number" id="quote_number" disabled></b-form-input>
        </b-form-group>
        <b-form-group label="Number of Beds" label-for="number_of_beds">
          <b-form-input v-model.number="editForm.number_of_beds" id="number_of_beds" type="number" required></b-form-input>
        </b-form-group>
        <b-form-group label="Number of Guests" label-for="number_of_guests">
          <b-form-input v-model.number="editForm.number_of_guests" id="number_of_guests" type="number" required></b-form-input>
        </b-form-group>
        <b-form-group label="Unit Bed Cost" label-for="unit_bed_cost">
          <b-form-input v-model.number="editForm.unit_bed_cost" id="unit_bed_cost" type="number" step="0.01" required></b-form-input>
        </b-form-group>
        <b-form-group label="Unit Breakfast Cost" label-for="unit_breakfast_cost">
          <b-form-input v-model.number="editForm.unit_breakfast_cost" id="unit_breakfast_cost" type="number" step="0.01"></b-form-input>
        </b-form-group>
        <b-form-group label="Unit Lunch Cost" label-for="unit_lunch_cost">
          <b-form-input v-model.number="editForm.unit_lunch_cost" id="unit_lunch_cost" type="number" step="0.01"></b-form-input>
        </b-form-group>
        <b-form-group label="Unit Dinner Cost" label-for="unit_dinner_cost">
          <b-form-input v-model.number="editForm.unit_dinner_cost" id="unit_dinner_cost" type="number" step="0.01"></b-form-input>
        </b-form-group>
        <b-form-group label="Guest Details" label-for="guest_details">
          <b-form-textarea v-model="editForm.guest_details" id="guest_details" rows="2"></b-form-textarea>
        </b-form-group>
        <b-form-group label="Check-in Date" label-for="check_in_date">
          <b-form-input v-model="editForm.check_in_date" id="check_in_date" type="date" required></b-form-input>
        </b-form-group>
        <b-form-group label="Check-out Date" label-for="check_out_date">
          <b-form-input v-model="editForm.check_out_date" id="check_out_date" type="date" required></b-form-input>
        </b-form-group>
        <b-form-group label="Breakfast Dates" label-for="breakfast_dates">
          <b-form-input v-model="editForm.breakfast_dates" id="breakfast_dates" type="text" placeholder="Enter as JSON array (e.g., [\"2025-06-01\"])"></b-form-input>
        </b-form-group>
        <b-form-group label="Lunch Dates" label-for="lunch_dates">
          <b-form-input v-model="editForm.lunch_dates" id="lunch_dates" type="text" placeholder="Enter as JSON array (e.g., [\"2025-06-01\"])"></b-form-input>
        </b-form-group>
        <b-form-group label="Dinner Dates" label-for="dinner_dates">
          <b-form-input v-model="editForm.dinner_dates" id="dinner_dates" type="text" placeholder="Enter as JSON array (e.g., [\"2025-06-01\"])"></b-form-input>
        </b-form-group>
        <b-form-group label="Discount Percentage" label-for="discount_percentage">
          <b-form-input v-model.number="editForm.discount_percentage" id="discount_percentage" type="number" min="0" max="100"></b-form-input>
        </b-form-group>
        <b-form-group label="Document Type" label-for="document_type">
          <b-form-select v-model="editForm.document_type" id="document_type" :options="documentTypeOptions" required></b-form-select>
        </b-form-group>
        <b-form-group label="Mark as" label-for="invoice_status">
          <b-form-select v-model="editForm.invoice_status" id="invoice_status" :options="statusOptions" required></b-form-select>
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="secondary" @click="cancel()">Cancel</b-button>
        <b-button size="sm" variant="primary" @click="ok()">Update</b-button>
      </template>
    </b-modal>

    <!-- Add Modal -->
    <b-modal v-model="showAddModal" title="Add New Quote" @ok="addQuote" @cancel="resetAddForm">
      <b-form>
        <b-form-group label="Client" label-for="client_id">
          <b-form-select v-model="newQuote.client_id" id="client_id" :options="clientOptions" required></b-form-select>
        </b-form-group>
        <b-form-group label="Quote Number" label-for="quote_number">
          <b-form-input v-model="newQuote.quote_number" id="quote_number" disabled></b-form-input>
        </b-form-group>
        <b-form-group label="Number of Beds" label-for="number_of_beds">
          <b-form-input v-model.number="newQuote.number_of_beds" id="number_of_beds" type="number" required></b-form-input>
        </b-form-group>
        <b-form-group label="Number of Guests" label-for="number_of_guests">
          <b-form-input v-model.number="newQuote.number_of_guests" id="number_of_guests" type="number" required></b-form-input>
        </b-form-group>
        <b-form-group label="Unit Bed Cost" label-for="unit_bed_cost">
          <b-form-input v-model.number="newQuote.unit_bed_cost" id="unit_bed_cost" type="number" step="0.01" required></b-form-input>
        </b-form-group>
        <b-form-group label="Unit Breakfast Cost" label-for="unit_breakfast_cost">
          <b-form-input v-model.number="newQuote.unit_breakfast_cost" id="unit_breakfast_cost" type="number" step="0.01"></b-form-input>
        </b-form-group>
        <b-form-group label="Unit Lunch Cost" label-for="unit_lunch_cost">
          <b-form-input v-model.number="newQuote.unit_lunch_cost" id="unit_lunch_cost" type="number" step="0.01"></b-form-input>
        </b-form-group>
        <b-form-group label="Unit Dinner Cost" label-for="unit_dinner_cost">
          <b-form-input v-model.number="newQuote.unit_dinner_cost" id="unit_dinner_cost" type="number" step="0.01"></b-form-input>
        </b-form-group>
        <b-form-group label="Guest Details" label-for="guest_details">
          <b-form-textarea v-model="newQuote.guest_details" id="guest_details" rows="2"></b-form-textarea>
        </b-form-group>
        <b-form-group label="Check-in Date" label-for="check_in_date">
          <b-form-input v-model="newQuote.check_in_date" id="check_in_date" type="date" required></b-form-input>
        </b-form-group>
        <b-form-group label="Check-out Date" label-for="check_out_date">
          <b-form-input v-model="newQuote.check_out_date" id="check_out_date" type="date" required></b-form-input>
        </b-form-group>
        <b-form-group label="Breakfast Dates" label-for="breakfast_dates">
          <b-form-input v-model="newQuote.breakfast_dates" id="breakfast_dates" type="text" placeholder="Enter as JSON array (e.g., [\"2025-06-01\"])"></b-form-input>
        </b-form-group>
        <b-form-group label="Lunch Dates" label-for="lunch_dates">
          <b-form-input v-model="newQuote.lunch_dates" id="lunch_dates" type="text" placeholder="Enter as JSON array (e.g., [\"2025-06-01\"])"></b-form-input>
        </b-form-group>
        <b-form-group label="Dinner Dates" label-for="dinner_dates">
          <b-form-input v-model="newQuote.dinner_dates" id="dinner_dates" type="text" placeholder="Enter as JSON array (e.g., [\"2025-06-01\"])"></b-form-input>
        </b-form-group>
        <b-form-group label="Discount Percentage" label-for="discount_percentage">
          <b-form-input v-model.number="newQuote.discount_percentage" id="discount_percentage" type="number" min="0" max="100"></b-form-input>
        </b-form-group>
        <b-form-group label="Document Type" label-for="document_type">
          <b-form-select v-model="newQuote.document_type" id="document_type" :options="documentTypeOptions" required></b-form-select>
        </b-form-group>
      </b-form>
    </b-modal>

    <!-- Delete Confirmation Modal -->
    <b-modal v-model="deleteModalShow" title="Confirm Delete" @ok="deleteQuote">
      <p>Are you sure you want to delete this quote?</p>
    </b-modal>

    <!-- Edit Error Modal -->
    <b-modal v-model="editErrorModalShow" title="Edit Error" ok-only ok-title="OK">
      <p class="text-danger">{{ editErrorMessage || 'An error occurred while updating the quote.' }}</p>
    </b-modal>

    <!-- Add Error Modal -->
    <b-modal v-model="addErrorModalShow" title="Add Error" ok-only ok-title="OK">
      <p class="text-danger">{{ addErrorMessage || 'An error occurred while adding the quote.' }}</p>
    </b-modal>

    <!-- Edit Success Modal -->
    <b-modal v-model="editSuccessModalShow" title="Update Successful" ok-only ok-title="OK">
      <div class="d-flex align-items-center">
        <b-icon icon="check-circle-fill" variant="success" class="mr-2"></b-icon>
        <p class="mb-0">Quote updated successfully!</p>
      </div>
    </b-modal>

    <!-- Add Success Modal -->
    <b-modal v-model="addSuccessModalShow" title="New Quote Added" ok-only ok-title="OK">
      <div class="d-flex align-items-center">
        <b-icon icon="check-circle-fill" variant="success" class="mr-2"></b-icon>
        <p class="mb-0">New quote added successfully!</p>
      </div>
    </b-modal>
  </div>
</template>
<script>
import LightQuotesTable from '@/views/Tables/RegularTables/LightQuotesTable';
import api from '@/api';

export default {
  components: {
    LightQuotesTable
  },
  data() {
    return {
      quotes: [],
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
      selectedQuote: null,
      editModalShow: false,
      editForm: {
        quote_id: null,
        client_id: null,
        quote_number: '',
        number_of_beds: 0,
        number_of_guests: 0,
        unit_bed_cost: 0,
        unit_breakfast_cost: 0,
        unit_lunch_cost: 0,
        unit_dinner_cost: 0,
        guest_details: '',
        check_in_date: '',
        check_out_date: '',
        breakfast_dates: '',
        lunch_dates: '',
        dinner_dates: '',
        discount_percentage: 0,
        document_type: 'detailed',
        invoice_status: 'unpaid'
      },
      showAddModal: false,
      newQuote: {
        client_id: null,
        number_of_beds: 0,
        number_of_guests: 0,
        unit_bed_cost: 0,
        unit_breakfast_cost: 0,
        unit_lunch_cost: 0,
        unit_dinner_cost: 0,
        guest_details: '',
        check_in_date: '',
        check_out_date: '',
        breakfast_dates: '',
        lunch_dates: '',
        dinner_dates: '',
        discount_percentage: 0,
        document_type: 'detailed'
      },
      deleteModalShow: false,
      quoteToDelete: null,
      statusOptions: [
        { value: 'unpaid', text: 'Unpaid' },
        { value: 'invoiced', text: 'Paid' }
      ],
      documentTypeOptions: [
        { value: 'detailed', text: 'Detailed' },
        { value: 'summarized', text: 'Summarized' }
      ]
    };
  },
  computed: {
    clientOptions() {
      return this.clients.map(client => ({
        value: client.client_id,
        text: `${client.first_name} ${client.last_name || ''}`.trim()
      }));
    }
  },
  async mounted() {
    await this.fetchClients();
    await this.fetchQuotes();
  },
  methods: {
    async fetchClients() {
      try {
        const response = await api.getClients();
        this.clients = response.data || [];
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    },
    async fetchQuotes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.getQuotes();
        this.quotes = response.data || [];
      } catch (error) {
        console.error('Failed to fetch quotes:', error);
        this.error = 'Failed to load quotes. Please try again later.';
        this.quotes = [];
      } finally {
        this.loading = false;
      }
    },
    getClientName(clientId) {
      const client = this.clients.find(c => c.client_id === clientId);
      return client ? `${client.first_name} ${client.last_name || ''}`.trim() : 'Unknown Client';
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    },
    viewQuote(quote) {
      this.selectedQuote = { ...quote }; // Clone to avoid mutation
      this.viewModalShow = true;
    },
    editQuote() {
      if (this.selectedQuote) {
        this.editForm = {
          quote_id: this.selectedQuote.quote_id,
          client_id: this.selectedQuote.client_id,
          quote_number: this.selectedQuote.quote_number,
          number_of_beds: this.selectedQuote.number_of_beds,
          number_of_guests: this.selectedQuote.number_of_guests,
          unit_bed_cost: this.selectedQuote.unit_bed_cost,
          unit_breakfast_cost: this.selectedQuote.unit_breakfast_cost,
          unit_lunch_cost: this.selectedQuote.unit_lunch_cost,
          unit_dinner_cost: this.selectedQuote.unit_dinner_cost,
          guest_details: this.selectedQuote.guest_details,
          check_in_date: this.selectedQuote.check_in_date,
          check_out_date: this.selectedQuote.check_out_date,
          breakfast_dates: JSON.stringify(this.selectedQuote.breakfast_dates || []),
          lunch_dates: JSON.stringify(this.selectedQuote.lunch_dates || []),
          dinner_dates: JSON.stringify(this.selectedQuote.dinner_dates || []),
          discount_percentage: this.selectedQuote.discount_percentage,
          document_type: this.selectedQuote.document_type,
          invoice_status: this.selectedQuote.invoice_status
        };
        this.viewModalShow = false;
        this.editModalShow = true;
      }
    },
    async updateQuote(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.editErrorMessage = null;
      this.editSuccessModalShow = false;
      try {
        const data = {
          client_id: this.editForm.client_id,
          number_of_beds: parseInt(this.editForm.number_of_beds),
          number_of_guests: parseInt(this.editForm.number_of_guests),
          unit_bed_cost: parseFloat(this.editForm.unit_bed_cost),
          unit_breakfast_cost: parseFloat(this.editForm.unit_breakfast_cost),
          unit_lunch_cost: parseFloat(this.editForm.unit_lunch_cost),
          unit_dinner_cost: parseFloat(this.editForm.unit_dinner_cost),
          guest_details: this.editForm.guest_details,
          check_in_date: this.editForm.check_in_date,
          check_out_date: this.editForm.check_out_date,
          breakfast_dates: JSON.parse(this.editForm.breakfast_dates || '[]'),
          lunch_dates: JSON.parse(this.editForm.lunch_dates || '[]'),
          dinner_dates: JSON.parse(this.editForm.dinner_dates || '[]'),
          discount_percentage: parseInt(this.editForm.discount_percentage),
          document_type: this.editForm.document_type,
          invoice_status: this.editForm.invoice_status,
          subtotal: 0, // Calculated server-side
          vat: 0, // Calculated server-side
          total: 0 // Calculated server-side
        };
        const response = await api.updateQuote(this.editForm.quote_id, data);
        if (response.data.message === 'Quote updated') {
          if (data.invoice_status === 'invoiced') {
            await this.copyToInvoice(this.editForm.quote_id, data);
          }
          await this.fetchQuotes();
          this.editSuccessModalShow = true;
          setTimeout(() => {
            this.editSuccessModalShow = false;
          }, 2000);
        } else {
          throw new Error('Unexpected response: ' + JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Failed to update quote:', error);
        this.editErrorMessage = error.message || 'Failed to update quote. Please check the server or network.';
        this.editErrorModalShow = true;
      }
      this.editModalShow = false;
    },
    resetEditForm() {
      this.editForm = {
        quote_id: null,
        client_id: null,
        quote_number: '',
        number_of_beds: 0,
        number_of_guests: 0,
        unit_bed_cost: 0,
        unit_breakfast_cost: 0,
        unit_lunch_cost: 0,
        unit_dinner_cost: 0,
        guest_details: '',
        check_in_date: '',
        check_out_date: '',
        breakfast_dates: '',
        lunch_dates: '',
        dinner_dates: '',
        discount_percentage: 0,
        document_type: 'detailed',
        invoice_status: 'unpaid'
      };
    },
    confirmDelete() {
      if (this.selectedQuote) {
        this.quoteToDelete = this.selectedQuote.quote_id;
      }
      this.viewModalShow = false;
      this.deleteModalShow = true;
    },
    async deleteQuote() {
      try {
        await api.deleteQuote(this.quoteToDelete);
        this.quotes = this.quotes.filter(q => q.quote_id !== this.quoteToDelete);
        this.deleteModalShow = false;
      } catch (error) {
        console.error('Failed to delete quote:', error);
        this.error = 'Failed to delete quote. Please try again.';
      }
    },
    async addQuote(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.addErrorMessage = null;
      this.addSuccessModalShow = false;
      try {
        const data = {
          client_id: this.newQuote.client_id,
          number_of_beds: parseInt(this.newQuote.number_of_beds),
          number_of_guests: parseInt(this.newQuote.number_of_guests),
          unit_bed_cost: parseFloat(this.newQuote.unit_bed_cost),
          unit_breakfast_cost: parseFloat(this.newQuote.unit_breakfast_cost),
          unit_lunch_cost: parseFloat(this.newQuote.unit_lunch_cost),
          unit_dinner_cost: parseFloat(this.newQuote.unit_dinner_cost),
          guest_details: this.newQuote.guest_details,
          check_in_date: this.newQuote.check_in_date,
          check_out_date: this.newQuote.check_out_date,
          breakfast_dates: JSON.parse(this.newQuote.breakfast_dates || '[]'),
          lunch_dates: JSON.parse(this.newQuote.lunch_dates || '[]'),
          dinner_dates: JSON.parse(this.newQuote.dinner_dates || '[]'),
          discount_percentage: parseInt(this.newQuote.discount_percentage),
          document_type: this.newQuote.document_type,
          invoice_status: 'unpaid', // Default for new quotes
          subtotal: 0, // Calculated server-side
          vat: 0, // Calculated server-side
          total: 0 // Calculated server-side
        };
        const response = await api.createQuote(data);
        if (response.data.message === 'Quote created') {
          const newQuote = {
            quote_id: response.data.quote_id,
            quote_number: response.data.quote_number,
            client_id: data.client_id,
            number_of_beds: data.number_of_beds,
            number_of_guests: data.number_of_guests,
            unit_bed_cost: data.unit_bed_cost,
            unit_breakfast_cost: data.unit_breakfast_cost,
            unit_lunch_cost: data.unit_lunch_cost,
            unit_dinner_cost: data.unit_dinner_cost,
            guest_details: data.guest_details,
            check_in_date: data.check_in_date,
            check_out_date: data.check_out_date,
            breakfast_dates: data.breakfast_dates,
            lunch_dates: data.lunch_dates,
            dinner_dates: data.dinner_dates,
            discount_percentage: data.discount_percentage,
            subtotal: 0, // Updated by server
            vat: 0, // Updated by server
            total: 0, // Updated by server
            document_type: data.document_type,
            invoice_status: 'unpaid',
            created_at: new Date().toISOString(),
            last_modified: new Date().toISOString()
          };
          this.quotes.push(newQuote);
          this.addSuccessModalShow = true;
          setTimeout(() => {
            this.addSuccessModalShow = false;
          }, 2000);
        } else {
          throw new Error('Unexpected response: ' + JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Failed to add quote:', error);
        this.addErrorMessage = error.message || 'Failed to add quote. Please check the server or network.';
        this.addErrorModalShow = true;
      }
      this.showAddModal = false;
    },
    resetAddForm() {
      this.newQuote = {
        client_id: null,
        number_of_beds: 0,
        number_of_guests: 0,
        unit_bed_cost: 0,
        unit_breakfast_cost: 0,
        unit_lunch_cost: 0,
        unit_dinner_cost: 0,
        guest_details: '',
        check_in_date: '',
        check_out_date: '',
        breakfast_dates: '',
        lunch_dates: '',
        dinner_dates: '',
        discount_percentage: 0,
        document_type: 'detailed'
      };
    },
    async copyToInvoice(quoteId, data) {
      try {
        const invoiceData = {
          client_id: data.client_id,
          invoice_number: data.quote_number, // Reuse quote_number as invoice_number
          number_of_beds: data.number_of_beds,
          number_of_guests: data.number_of_guests,
          unit_bed_cost: data.unit_bed_cost,
          unit_breakfast_cost: data.unit_breakfast_cost,
          unit_lunch_cost: data.unit_lunch_cost,
          unit_dinner_cost: data.unit_dinner_cost,
          guest_details: data.guest_details,
          check_in_date: data.check_in_date,
          check_out_date: data.check_out_date,
          breakfast_dates: data.breakfast_dates,
          lunch_dates: data.lunch_dates,
          dinner_dates: data.dinner_dates,
          discount_percentage: data.discount_percentage,
          subtotal: data.subtotal,
          vat: data.vat,
          total: data.total,
          document_type: data.document_type,
          attached_documents: [], // Default empty
          invoice_date: new Date().toISOString().split('T')[0],
          purchase_order_number: null // Can be added later
        };
        await api.createInvoice(invoiceData); // Placeholder method
      } catch (error) {
        console.error('Failed to copy to invoice:', error);
        this.editErrorMessage = 'Failed to mark as paid and copy to invoice.';
        this.editErrorModalShow = true;
      }
    }
  }
};
</script>