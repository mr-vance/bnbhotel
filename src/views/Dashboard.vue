<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-container fluid>
        <b-row>
          <b-col>
            <h1 class="text-white mb-0">Welcome to YUMOMITSO Invoicing System</h1>
            <p class="text-white mt-0 mb-5">
              Manage clients, quotes, and invoices for your guesthouse efficiently.
            </p>
          </b-col>
        </b-row>
      </b-container>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row>
        <b-col>
          <card>
            <h3 slot="header" class="mb-0">Dashboard</h3>
            <p>Placeholder for summary stats or key actions (e.g., view quotes, create client).</p>
            <!-- Future content like stats cards or tables can be added here -->
          </card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  }
};
</script>
<style></style>