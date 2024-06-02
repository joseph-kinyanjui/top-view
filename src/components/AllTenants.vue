<script setup>
import { computed, ref } from "vue";
import { useTenantsList } from "../stores/tenants.js";

const tenantsStore = useTenantsList();

const tenants = ref(tenantsStore.tenants)


const activeTenants = tenants.value.filter((tenant) => tenant.status === "active");

const terminatedTenants = tenants.value.filter((tenant) => tenant.status === "terminated");

const total_deposit_active_tenants = computed(() => {
    return activeTenants.reduce((acc, item) => acc + item.deposit_held, 0);
});

const total_deposit_terminated_tenants = computed(() => {
    return terminatedTenants.reduce((acc, item) => acc + item.deposit_held, 0);
});
</script>

/**HTML*/
<template>
    <div class="all_tenants_wrap">
        <div class="active_tenant">
            <table style="width: 100%">
                <caption>
                    <h2>Active Tenants</h2>
                </caption>
                <tr class="table_header">
                    <th class="tenant_name">Tenant's name</th>
                    <th class="property_name">Property Name:</th>
                    <th class="tenant_number">Contact:</th>
                    <th class="hse_number">Hse Number:</th>
                    <th class="deposit_held">Deposit Paid</th>
                </tr>

                <tr class="house" v-for="hse in tenants" :key="hse.hse_number">
                    <template v-if="hse.status == 'act ive'">
                        <td class="tenant_name">{{ hse.tenant_name }}</td>
                        <td class="hse_number">{{ hse.property_name }}</td>
                        <td class="tenant_number">{{ hse.tenant_number }}</td>
                        <td class="hse_number">{{ hse.hse_number }}</td>
                        <td class="deposit_held">{{ hse.deposit_held }}</td>
                    </template>
                </tr>

                <tr class="totals_row">
                    <td colspan="4">
                        <div class="totals">Total Deposit held for active tenants</div>
                    </td>
                    <td>{{ total_deposit_active_tenants }}</td>
                </tr>
            </table>
        </div>

        <div class="terminated_tenant">
            <table style="width: 100%">
                <caption>
                    <h2>Terminated Tenants</h2>
                </caption>
                <tr class="table_header">
                    <th class="tenant_name">Tenant's name</th>
                    <th class="property_name">Property Name:</th>
                    <th class="tenant_number">Contact:</th>
                    <th class="hse_number">Hse Number:</th>
                    <th class="deposit_held">Deposit Paid</th>
                    <th class="deposit_refunded">Deposit Refunded</th>
                </tr>

                <tr class="house" v-for="hse in tenants" :key="hse.hse_number">
                    <template v-if="hse.status == 'terminated'">
                        <td class="tenant_name">{{ hse.tenant_name }}</td>
                        <td class="hse_number">{{ hse.property_name }}</td>
                        <td class="tenant_number">{{ hse.tenant_number }}</td>
                        <td class="hse_number">{{ hse.hse_number }}</td>
                        <td class="deposit_held">{{ hse.deposit_held }}</td>
                        <td class="deposit_refunded">True</td>
                    </template>
                </tr>

                <tr class="totals_row">
                    <td colspan="4">
                        <div class="totals">Total Deposit refunded for terminated tenants</div>
                    </td>
                    <td colspan="2">{{ total_deposit_terminated_tenants }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style scoped>
.active_tenant{
    max-height: 55vh;
    overflow: scroll;
}
</style>
