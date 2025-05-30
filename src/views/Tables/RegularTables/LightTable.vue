<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <h3 class="mb-0">Clients</h3>
    </b-card-header>

    <div class="table-wrapper">
      <el-table class="table-responsive table" header-row-class-name="thead-light" :data="clients">
        <el-table-column label="ID" min-width="100px" prop="client_id"></el-table-column>
        <el-table-column label="Name" min-width="310px">
          <template v-slot="{row}">
            <b-media no-body class="align-items-center">
              <a href="#" class="avatar rounded-circle mr-3">
                <img alt="Image placeholder" src="img/theme/team-1.jpg">
              </a>
              <b-media-body>
                <span class="font-weight-600 name mb-0 text-sm">{{row.first_name}} {{row.last_name}}</span>
              </b-media-body>
            </b-media>
          </template>
        </el-table-column>
        <el-table-column label="Email" prop="email_address" min-width="200px"></el-table-column>
        <el-table-column label="Phone" prop="phone_number" min-width="150px"></el-table-column>
        <el-table-column label="Company" prop="company_name" min-width="200px">
          <template v-slot="{row}">
            <span>{{row.company_name || 'N/A'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" min-width="120px" fixed="right">
          <template v-slot="{row}">
            <div class="d-flex flex-column align-items-center">
              <b-button size="sm" variant="info" class="mb-1 action-btn" @click="$emit('edit-client', row)">Edit</b-button>
              <b-button size="sm" variant="danger" class="action-btn" @click="$emit('delete-client', row.client_id)">Delete</b-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <b-card-footer class="py-4 d-flex justify-content-end">
      <base-pagination v-model="currentPage" :per-page="10" :total="totalItems"></base-pagination>
    </b-card-footer>
  </b-card>
</template>
<script>
import { Table, TableColumn } from 'element-ui';

export default {
  name: 'light-table',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  props: {
    clients: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentPage: 1,
      totalItems: 0
    };
  },
  watch: {
    clients(newClients) {
      this.totalItems = newClients.length;
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
  min-width: 960px;
}

.action-btn {
  width: 80px; /* Fixed width for consistency */
  font-size: 0.75rem; /* Smaller but readable text */
  padding: 4px 8px; /* Adjust padding for smaller buttons */
}

/* Adjust for smaller screens */
@media (max-width: 767.98px) {
  .el-table {
    min-width: 800px;
  }

  .action-btn {
    width: 70px;
    font-size: 0.7rem;
    padding: 3px 6px;
  }
}
</style>