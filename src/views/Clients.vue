<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-container fluid>
        <b-row class="align-items-center">
          <b-col>
            <h1 class="text-white mb-0">Clients</h1>
            <p class="text-white mt-0 mb-0">Manage your client database</p>
          </b-col>
          <b-col class="text-right">
            <base-button type="primary" @click="showModal = true">New Client</base-button>
          </b-col>
        </b-row>
      </b-container>
    </base-header>
    <b-container fluid class="mt--7">
      <b-row>
        <b-col>
          <light-table :clients="clients" @edit="openEditModal" />
        </b-col>
      </b-row>
    </b-container>
    <client-form
      :show="showModal"
      :client-data="selectedClient"
      @update:show="showModal = $event"
      @success="handleSuccess"
      @error="handleError"
    />
  </div>
</template>
<script>
import { BaseHeader, BaseButton } from '@/components';
import LightTable from './Tables/RegularTables/LightTable';
import ClientForm from '@/components/ClientForm.vue';
import axios from 'axios';

export default {
  components: {
    BaseHeader,
    BaseButton,
    LightTable,
    ClientForm
  },
  data() {
    return {
      clients: [],
      showModal: false,
      selectedClient: {},
      loading: false
    };
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    async fetchClients() {
      this.loading = true;
      try {
        const response = await axios.get('https://www.milkandhoneybnb.com/api/clients.php');
        this.clients = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        this.loading = false;
      }
    },
    openEditModal(client) {
      this.selectedClient = { ...client };
      this.showModal = true;
    },
    handleSuccess() {
      this.fetchClients();
      this.$bvToast.toast('Client saved successfully', {
        title: 'Success',
        variant: 'success',
        solid: true
      });
    },
    handleError(error) {
      this.$bvToast.toast(error, {
        title: 'Error',
        variant: 'danger',
        solid: true
      });
    }
  }
};
</script>
<style></style>