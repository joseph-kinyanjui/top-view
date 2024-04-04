<script setup>
import { computed, ref } from 'vue'
import { usePropertiesList } from '../stores/properties.js'
import { useTenantsList } from '../stores/tenants.js'

const tenantsStore = useTenantsList()
const propertiesStore = usePropertiesList()

const tenants = tenantsStore.tenants

const properties = propertiesStore.properties

let showTenants = ref([])

const filteredTenantsList = ref([]);

const showingTenantsList = ref(false)
const showingPropertiesList = ref(true)

const total_commision = computed(() => {
    return properties.reduce((acc, item) => acc + item.commision, 0);
});

const total_rent_collected = computed(() => {
    return filteredTenantsList.value.reduce((acc, item) => acc + item.rent_paid, 0);
});

const total_unpaid_rent = computed(() => {
    return filteredTenantsList.value.reduce((acc, item) => acc + item.unpaid_rent, 0);
});


const total_deposit_held = computed(() => {
    return filteredTenantsList.value.reduce((acc, item) => acc + item.deposit_held, 0);
});

const total_arrears_cf = computed(() => {
    return filteredTenantsList.value.reduce((acc, item) => acc + item.arrears_cf, 0);
});

const total_arrears_bf = computed(() => {
    return filteredTenantsList.value.reduce((acc, item) => acc + item.arrears_bf, 0);
});

const back_to_properties_list = () => {
    showingTenantsList.value = false
    showingPropertiesList.value = true
}

const addLandlord = (propertyName) => {
    console.log(tenants.length)
    showTenants.value = propertyName
    showingTenantsList.value = true
    showingPropertiesList.value = false
    filteredTenantsList.value = tenants.filter((tenant) => tenant.property_name === propertyName);
}



</script>

/*HTML*/
<template>

    <div class="property_list">
        <div class="properties" v-show="showingPropertiesList == true">
            <table style="width: 100%;">
                <caption><h2>Properties List </h2></caption>
                <tr class="table_header">
                    <th class="property_name">Property Name </th>
                    <th class="landlord_contact">Contact </th>
                    <th class="commision">Commision</th>
                    <th class="payment_date">Payment Date</th>
                    <th class="payment_mode">Mode</th>
                    <th class="bank_name"> Bank Name</th>
                    <th class="account_number">Account Number</th>

                </tr>
                <tr class="house" v-for="property in filterdPaymentsList" :key="property.property_name">
                    <td class="property_name">{{ property.property_name }} </td>
                    <td class="property_location">{{ property.property_location }}</td>
                    <td class="owner_contact">{{ property.contact }} </td>
                    <td class="commision-due">{{ property.commision }}</td>
                    <td class="payment">{{ property.payment_date }}</td>
                    <td class="payment_mode"> {{ property.payment_mode }}</td>
                    <td class="bank_name"> {{ property.bank_name }}</td>
                    <td class="owner_account_number">{{ property.account_number }} </td>

                </tr>

                <tr class="totals_row">
                    <td  colspan="3">Total Commision Collected</td>
                    <td>{{ total_commision }}</td>
                    <td  colspan="4"></td>
                </tr>

            </table>
        </div>
        <template v-if="showTenants">
            <div class="tenant_per_property" v-show="showingTenantsList == true">
                <div class="back_to_properties_list">
                    <button @click.prevent="back_to_properties_list" class="back_to_propeties_button">Back to Properties List</button>
                </div>
                <div class="tenant">
                    <table style="width:100%">
                        <caption><h2>Tenants List for {{ showTenants }}</h2></caption>
                        <tr class="table_header">
                            <th class="property_name">Property Name: </th>
                            <th class="hse_number">Hse Number: </th>
                            <th class="teenant_name">Tenant's name </th>
                            <th class="house_rate">Rate </th>
                            <th class="rent_paid">Rent Paid </th>
                            <th class="unpaid_rent">Arrears</th>
                            <th class="deposit_held">Deposit Paid</th>
                            <th class="arrears">Arrears BF</th>
                            <th class="arrears_cf"> Arrears CF:</th>
                            <th class="tenant_number">Contact:</th>
                            <th class="alternative_number">Alternative number </th>
                            <th class="id_number">Id Number</th>
                            <th class="status">Status</th>
                        </tr>
                        <tr class="house" v-for="hse in filteredTenantsList" :key="hse.hse_number">
                            <td class="hse_property_name">{{ hse.property_name }} </td>
                            <td class="hse_number">{{ hse.hse_number }} </td>
                            <td class="teenant_name">{{ hse.tenant_name }} </td>
                            <td class="house_rate">{{ hse.house_rate }} </td>
                            <td class="rent_paid">{{ hse.rent_paid }}</td>
                            <td class="unpaid_rent">{{ hse.unpaid_rent }}</td>
                            <td class="deposit_held">{{ hse.deposit_held }}</td>
                            <td class="arrears"> {{ hse.arrears }}</td>
                            <td class="arrears_cf"> {{ hse.arrears_cf }}</td>
                            <td class="tenant_number">{{ hse.tenant_number }} </td>
                            <td class="alternative_number">{{ hse.alternative_number }} </td>
                            <td class="id_number">{{ hse.id_number }} </td>
                            <td class="status">{{ hse.status }}</td>
                        </tr>

                        <tr class="totals_row">
                            <td colspan="4">Totals</td>
                            <td>{{ total_rent_collected }}</td>
                            <td>{{ total_unpaid_rent }}</td>
                            <td>{{ total_deposit_held }}</td>
                            <td>{{ total_arrears_bf }}</td>
                            <td>{{ total_arrears_cf }}</td>
                            <td colspan="4"></td>
                        </tr>

                    </table>
                </div>
            </div>
        </template>
    </div>


</template>

<style scoped>

</style>