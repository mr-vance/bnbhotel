<template>
  <modal :show="show" @close="closeModal" size="lg">
    <template slot="header">
      <h5 class="modal-title">{{ isEdit ? 'Edit Client' : 'New Client' }}</h5>
    </template>
    <b-form @submit.prevent="submitForm">
      <b-row>
        <b-col md="6">
          <base-input
            label="First Name *"
            name="first_name"
            v-model="client.first_name"
            :rules="{ required: true }"
            placeholder="Enter first name"
          />
        </b-col>
        <b-col md="6">
          <base-input
            label="Last Name"
            name="last_name"
            v-model="client.last_name"
            placeholder="Enter last name"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <base-input
            label="Email Address *"
            name="email_address"
            v-model="client.email_address"
            :rules="{ required: true, email: true }"
            placeholder="Enter email address"
            type="email"
          />
        </b-col>
        <b-col md="6">
          <base-input
            label="Phone Number"
            name="phone_number"
            v-model="client.phone_number"
            placeholder="Enter phone number"
            type="tel"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <base-input
            label="Company Name"
            name="company_name"
            v-model="client.company_name"
            placeholder="Enter company name"
          />
        </b-col>
        <b-col md="6">
          <base-input
            label="Company VAT Number"
            name="company_vat_number"
            v-model="client.company_vat_number"
            placeholder="Enter VAT number"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <base-input
            label="Company Address"
            name="company_address"
            v-model="client.company_address"
            placeholder="Enter company address"
            type="textarea"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <base-input
            label="Company Website"
            name="company_website"
            v-model="client.company_website"
            placeholder="Enter website URL"
            type="url"
          />
        </b-col>
      </b-row>
    </b-form>
    <template slot="footer">
      <base-button type="secondary" @click="closeModal">Cancel</base-button>
      <base-button type="primary" @click="submitForm" :disabled="loading">
        {{ isEdit ? 'Update' : 'Create' }}
      </base-button>
    </template>
  </modal>
</template>
<script>
import { Modal, BaseInput, BaseButton } from '@/components';
import axios from 'axios';

export default {
  name: 'ClientForm',
  components: {
    Modal,
    BaseInput,
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    clientData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      client: {
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        company_name: '',
        company_address: '',
        company_vat_number: '',
        company_website: ''
      },
      loading: false,
      isEdit: false
    };
  },
  watch: {
    clientData: {
      handler(newVal) {
        if (newVal && Object.keys(newVal).length) {
          this.client = { ...newVal };
          this.isEdit = true;
        } else {
          this.resetForm();
          this.isEdit = false;
        }
      },
      immediate: true,
      deep: true
    },
    show(val) {
      if (!val) {
        this.resetForm();
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:show', false);
      this.resetForm();
    },
    resetForm() {
      this.client = {
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        company_name: '',
        company_address: '',
        company_vat_number: '',
        company_website: ''
      };
      this.isEdit = false;
    },
    async submitForm() {
      this.loading = true;
      try {
        const payload = { ...this.client };
        const url = 'https://www.milkandhoneybnb.com/api/clients.php';
        let response;

        if (this.isEdit) {
          response = await axios.put(`${url}?id=${this.client.client_id}`, payload);
        } else {
          response = await axios.post(url, payload);
        }

        this.$emit('success', response.data);
        this.closeModal();
      } catch (error) {
        this.$emit('error', error.response?.data?.error || 'An error occurred');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
<style></style>