import { defineStore } from "pinia";
import axios from "axios";

const TENANT_URL = "https://top-view-server-pacpqd0zx-joseph-kinyanjuis-projects.vercel.app/tenants";
const TENANT_STATEMENT_URL = "https://top-view-server-pacpqd0zx-joseph-kinyanjuis-projects.vercel.app/tenants/api/tenants/statements";

export const useTenantsList = defineStore("tenantsList", {
  state: () => ({
    tenants_full_rent_form: {
      hse_number: "",
      rent_paid: "",
      payment_date: "",
    },
    tenants_partial_rent_form: {
      hse_number: "",
      rent_paid: "",
      payment_date: "",
    },
    loading: false,
    current_payment_date: [{ month: "April-24" }],
    tenants: [],
    tenants_statements: [],
    holy_test: []
  }),
  actions: {
    async fetchTenants() {
      try {
        this.loading = true;
        const response = await axios.get(TENANT_URL);
        this.tenants = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching data", error);
        this.loading = false;
      }
    },
    async fetchTenantStatements() {
      try {
        const response = await axios.get(TENANT_STATEMENT_URL);
        this.tenants_statements = response.data;
      } catch (error) {
        console.error("error fetching data", error);
      }
    },
    async updateTenantsList(newTenantsList) {
      await fetch("/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTenantsList),
      });
    },
    async updateTenantStatements(newStatementItem) {
      console.log(newStatementItem);
      await this.updateTStatements(newStatementItem);
    },
    async updateTStatements(newStatementItem) {
      try {
        await axios.post(TENANT_STATEMENT_URL, newStatementItem);
      } catch (error) {
        console.error("error updating tenent statemennts", error);
      }
    },
    update_tenants_full_rent_form(field) {
      this.tenants_full_rent_form[field] = value;
    },
  },
});
