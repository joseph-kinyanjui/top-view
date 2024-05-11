<script setup>
import { computed, ref, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import { usePropertiesList } from '../stores/properties.js'
import { useTenantsList } from '../stores/tenants.js'

const tenantsStore = useTenantsList()
const propertiesStore = usePropertiesList()

const properties = propertiesStore.properties
const properties_statements = propertiesStore.properties_statements

const temp_properties_statements = ref([])
const tenants_full_rent_form = tenantsStore.tenants_full_rent_form
const tenants_partial_rent_form = tenantsStore.tenants_partial_rent_form
const update_payment_month_form = tenantsStore.update_payment_month_form
const now = new Date();
const current_payment_date = ref('April-2024')

const showUpdateProperty = ref([])
const showUpdateTenant = ref([])

let showPayments = propertiesStore.showPayments

const filteredPropertyStatements = ref([]);
const filteredUpdateProperty = ref([])
const filteredPropertiesList = ref([])

const showingPropertiesList = ref(true)


const showingPropertyStatements = ref(false)



const showingUpdateProperty = ref(false)

const payment_months_options = ref([
    { month: 'April-2024' },
    { month: 'May-2024' },
    { month: 'June-2024' },
    { month: 'July-2024' },
    { month: 'August-2024' },
    { month: 'September-2024' },
    { month: 'October-2024' },
    { month: 'November-2024' },
    { month: 'December-2024' },
    { month: 'January-2025' },
    { month: 'February-2025' },
    { month: 'March-2025' }
])

const tempShowProperty = ref([])
const tempShowTenant = ref([])
const loading = propertiesStore.loading

const back_to_properties_list = () => {
    showingUpdateTenant.value = false
    showingTenantsList.value = true
    showingTenantStatements.value = false
}
const from_property_statements = () => {
    showingPropertyStatements.value = false
    showingPropertiesList.value = true
}

const update_property_statements = (property) => {
    showingTenantsList.value = true
    showingPropertyStatements.value = false
    filteredTenantsList.value = tenants.filter((tenant) => tenant.property_name === property.property_name);
}

const view_property_statements_from_update_property = (property) => {
    console.log(property)
    propertiesStore.fetchPropertiesStatements()
    showPayments = property
    showingUpdateProperty.value = false
    showingPropertyStatements.value = true
    filteredUpdateProperty.value = filteredPropertiesList.value.filter((property) => property._id === tempShowProperty._id);
}

const view_property_statements = (property) => {
    console.log(property)
    propertiesStore.fetchPropertiesStatements()
    showPayments = property
    tempShowProperty.value = property
    showingPropertyStatements.value = true
    showingPropertiesList.value = false
    filteredPropertyStatements.value = properties_statements.filter((property_statement) => property_statement.property_id === property._id);

}


const submit_full_property_statement = (showUpdateProperty) => {
alert('pay me in full')
}

const submit_modified_property_statement = (showUpdateProperty) => {
alert('paid me partial')
}

const download_tenant_statement = async (tempShowTenant) => {
    let element = document.getElementById('tenant_statement_download');
    let opt = {
        margin: 0.15,
        filename: tempShowTenant.property_name + '_house_number_' + tempShowTenant.hse_number + '_statements.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 0.9 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();
}

const change_current_month = (payment_month) => {
    current_payment_date.value = payment_month
}


</script>

<template>
    <div class="update_property" >
     {{ showPayments }}
        <div >
            <div class="update_tenant_header">
                <div>
                    <div class="back_to_properties_list">
                        <button @click.prevent="view_property_statements_from_update_property(showPayments)" class="back_to_propeties_button">Back to
                            Property Statements
                            List</button>
                    </div>

                    <div class="tenant_updates_header">
                        <table style="width: 100%;">
                            <caption>
                                <h2>Update Property Statements</h2>
                            </caption>
                            <tr class="table_header">
                                <th class="property_name">Property Name </th>

                            </tr>
                            <tr class="house">
                                <td class="property_name">{{ showPayments.property_name }}</td>
                            </tr>

                            <tr class="totals_row">
                                <td></td>
                            </tr>

                        </table>
                    </div>

                    <div class="change_current_month">
                        <div class="current_month_header">
                            <h3>You are Updating property statements For: {{ current_payment_date }}</h3>
                        </div>

                        <div class="paid_in_full">
                            <div class="paid_in_full_header">
                                <h3>Change the Payment Month</h3>
                            </div>
                            <div class="paid_in_full_form">
                                <form @submit.prevent="change_current_month(update_payment_month_form.payment_date)">
                                    Payment Month: <select v-model="update_payment_month_form.payment_date" required
                                        class="select">
                                        <option disabled value="">Please select month</option>
                                        <option v-for="month in payment_months_options" :key="month">{{
                                            month.month }}
                                        </option>
                                    </select>

                                    <button class="view_tenants_button submit_button">submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="back_to_properties_list">
                    <button @click.prevent="view_property_statements_from_update_property(showUpdateProperty)"
                        class="back_to_propeties_button">View Property
                        Statements</button>
                </div>
            </div>
            <div class="update">
                <div class="paid_in_full">
                    <div class="paid_in_full_header">
                        <h3>Update full Property Statement</h3>
                    </div>
                    <div class="paid_in_full_form">
                        <form @submit.prevent="submit_full_property_statement(showUpdateProperty)">
                            House No: <select v-model="tenants_full_rent_form.hse_number" required class="select">
                                <option disabled value="">Please select house number</option>
                                <option>{{ showUpdateTenant.hse_number }}</option>
                            </select>
                            Month: <select v-model="tenants_full_rent_form.payment_date" required class="select">
                                <option disabled value="">Please select month</option>
                                <option v-for="month in payment_months_options" :key="month">{{ month.month }}
                                </option>
                            </select>

                            <button class="view_tenants_button submit_button">submit</button>
                        </form>
                    </div>
                </div>

                <div class="paid_in_full">
                    <div class="paid_in_full_header">
                        <h3>Partial Payment</h3>
                    </div>
                    <div class="paid_in_full_form">
                        <form @submit.prevent="submit_modified_property_statement(showUpdateProperty)">
                            House No:<select v-model="tenants_partial_rent_form.hse_number" required class="select">
                                <option disabled value="">Please select house number</option>
                                <option>{{ showUpdateTenant.hse_number }}</option>
                            </select>
                            Month: <select v-model="tenants_partial_rent_form.payment_date" required class="select">
                                <option disabled value="">Please select month</option>
                                <option v-for="month in payment_months_options" :key="month">{{ month.month }}
                                </option>
                            </select>
                            Ammount Paid <input v-model="tenants_partial_rent_form.rent_paid" required
                                placeholder="Input Amount">

                            <button class="view_tenants_button submit_button">submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>