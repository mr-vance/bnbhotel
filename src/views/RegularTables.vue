<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-container fluid>
        <b-row>
          <b-col>
            <h1 class="text-white mb-0">Data Management</h1>
            <p class="text-white mt-0 mb-5">
              View and manage clients, quotes, or invoices.
            </p>
          </b-col>
        </b-row>
      </b-container>
    </base-header>
    <b-container fluid class="mt--7">
      <b-row>
        <b-col>
          <light-table />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import LightTable from "./Tables/RegularTables/LightTable";

export default {
  components: {
    LightTable
  },
  data() {
    return {};
  }
};
</script>
<style></style>