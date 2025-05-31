<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <h3 class="mb-0">Quotes</h3>
    </b-card-header>

    <div class="table-wrapper">
      <el-table
        class="table-responsive table"
        header-row-class-name="thead-light"
        :data="quotes"
        @row-click="handleRowClick"
      >
        <el-table-column label="Quote Number" prop="quote_number" min-width="150px">
          <template v-slot="{row}">
            <span>QUOTATION {{ row.quote_number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Client" min-width="200px">
          <template v-slot="{row}">
            <span>{{ getClientName(row.client_id) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Total Amount" min-width="150px">
          <template v-slot="{row}">
            <span>{{ formatCurrency(row.total) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" prop="invoice_status" min-width="120px">
          <template v-slot="{row}">
            <span>{{ row.invoice_status === 'invoiced' ? 'Paid' : 'Unpaid' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Check-in Date" prop="check_in_date" min-width="150px"></el-table-column>
        <el-table-column label="Check-out Date" prop="check_out_date" min-width="150px"></el-table-column>
      </el-table>
    </div>

    <b-card-footer class="py-4 d-flex justify-content-end">
      <base-pagination v-model="currentPage" :per-page="10" :total="totalItems"></base-pagination>
    </b-card-footer>
  </b-card>
</template>
<script>
import { Table, TableColumn } from 'element-ui';
import api from '@/api';

export default {
  name: 'light-quotes-table',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  props: {
    quotes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentPage: 1,
      totalItems: 0,
      clients: []
    };
  },
  async created() {
    await this.fetchClients();
  },
  watch: {
    quotes(newQuotes) {
      this.totalItems = newQuotes.length;
    }
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
    getClientName(clientId) {
      const client = this.clients.find(c => c.client_id === clientId);
      return client ? `${client.first_name} ${client.last_name || ''}`.trim() : 'Unknown Client';
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    },
    handleRowClick(row, column, event) {
      this.$emit('view-quote', row);
    }
  }
};
</script>
<style scoped>
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.el-table {
  width: 100%;
  min-width: 920px;
}

@media (max-width: 767.98px) {
  .el-table {
    min-width: 800px;
  }
}
</style>