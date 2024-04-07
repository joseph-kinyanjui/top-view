<script setup>
import { computed, ref } from 'vue'
import { usePropertiesList } from '../stores/properties.js'
import { useTenantsList } from '../stores/tenants.js'

const tenantsStore = useTenantsList()
const propertiesStore = usePropertiesList()

const tenants = tenantsStore.tenants
const tenants_full_rent_form = tenantsStore.tenants_full_rent_form
const current_payment_date = tenantsStore.current_payment_date[0].month

const properties = propertiesStore.properties

const showTenants = ref([])
const showPayments = ref([])
const showTenantStatements = ref([])
const showUpdateTenant = ref([])

const filteredTenantsList = ref([]);
const filteredPaymentsList = ref([]);
const filteredTenantStatements = ref([])
const filteredUpdateTenant = ref([])

const showingTenantsList = ref(false)
const showingPropertiesList = ref(true)
const showingPaymentsDetails = ref(false)
const showingTenantStatements = ref(false)
const showingUpdateTenant = ref(false)

const payment_months_options = ref([
    { month: 'April-24' },
    { month: 'May-24' },
    { month: 'June-24' },
    { month: 'July-24' },
    { month: 'August-24' },
    { month: 'September-24' },
    { month: 'October-24' },
    { month: 'November-24' },
    { month: 'December-24' },
    { month: 'January-25' },
    { month: 'February-5' },
    { month: 'March-25' }
])

const tempShowProperty = ref([])
const tempShowTenant = ref([])


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

const back_to_tenants_list = () => {
    showingUpdateTenant.value = false
    showingTenantsList.value = true
    showingTenantStatements.value = false

}

const from_payments_details = () => {
    showingPaymentsDetails.value = false
    showingPropertiesList.value = true
}

const view_tenants_from_payments = (propertyName) => {
    showingTenantsList.value = true
    showingPaymentsDetails.value = false
    filteredTenantsList.value = tenants.filter((tenant) => tenant.property_name === propertyName);
}

const view_payments_details = (propertyName) => {
    showPayments.value = propertyName
    tempShowProperty.value = propertyName
    showingPaymentsDetails.value = true
    showingPropertiesList.value = false
    filteredPaymentsList.value = properties.filter((property) => property.property_name === propertyName);
}

const view_tenant_statements = (hseNumber, propertyName) => {
    tempShowTenant.value = hseNumber
    showingTenantStatements.value = true
    showingTenantsList.value = false
    filteredTenantStatements.value = tenants.filter((tenant) => tenant.hse_number === hseNumber && tenant.property_name == propertyName);
    showTenantStatements.value = filteredTenantStatements.value[0]
}

const update_tenant = (hseNumber) => {
    showingUpdateTenant.value = true
    showingTenantsList.value = false
    filteredUpdateTenant.value = filteredTenantsList.value.filter((tenant) => tenant.hse_number === hseNumber);
    showUpdateTenant.value = filteredUpdateTenant.value[0]
}

const addLandlord = (propertyName) => {
    showTenants.value = propertyName
    showingTenantsList.value = true
    showingPropertiesList.value = false
    filteredTenantsList.value = tenants.filter((tenant) => tenant.property_name === propertyName);
}

const submit_full_rent = () => {
    console.log(tenants_full_rent_form)
    if (tenants_full_rent_form.hse_number == '' && tenants_full_rent_form.payment_date == '') {
        alert('Select valid house number & the payment date')
    } else if (tenants_full_rent_form.hse_number !== '' && tenants_full_rent_form.payment_date == '') {
        alert('Select a valid payment date')
    } else if (tenants_full_rent_form.hse_number == '' && tenants_full_rent_form.payment_date !== '') {
        alert('Select a valid house number')
    } else if (tenants_full_rent_form.hse_number !== '' && tenants_full_rent_form.payment_date !== '' && tenants_full_rent_form.payment_date == current_payment_date) {
        alert('Full rent for house number ' + tenants_full_rent_form.hse_number + ' for ' + tenants_full_rent_form.payment_date + ' has been updated succesfully ')
    }
    else {
        alert('Invalid input, check entries & try again')
    }

}



</script>

/*HTML*/
<template>

    <div class="property_list">
        <div class="properties" v-show="showingPropertiesList == true">
            <table style="width: 100%;">
                <caption>
                    <h2>Properties List </h2>
                </caption>
                <tr class="table_header">
                    <th class="landlord_name">Landlord Name: </th>
                    <th class="property_name">Property Name </th>
                    <th class="property_location">Location </th>
                    <th class="landlord_contact">Contact </th>
                    <th class="commision">Payment Details </th>
                    <th class="view_tenats">View Tenants</th>

                </tr>
                <tr class="house" v-for="property in properties" :key="property.property_name">
                    <td class="landlord_name">
                        <div>{{ property.landlord_name }} </div>
                    </td>
                    <td class="property_name">
                        <div>{{ property.property_name }} </div>
                    </td>
                    <td class="property_location">
                        <div>{{ property.property_location }} </div>
                    </td>
                    <td class="owner_contact">
                        <div>{{ property.contact }} </div>
                    </td>
                    <td class="commision-due"><button @click="view_payments_details(property.property_name)"
                            class="view_tenants_button">
                            Property Statements </button>
                    </td>
                    <td class="view_tenant__link">
                        <button @click="addLandlord(property.property_name)" class="view_tenants_button">
                            Tenants List</button>
                    </td>

                </tr>

                <tr class="totals_row">
                    <td colspan="6"></td>
                </tr>

            </table>
        </div>

        <template v-if="showPayments">
            <div class="payment_details" v-show="showingPaymentsDetails">
                <div class="payment_datils_nav">
                    <div class="back_to_properties_list">
                        <button @click.prevent="from_payments_details" class="back_to_propeties_button">Back to
                            Properties
                            List</button>
                    </div>
                    <div class="back_to_properties_list">
                        <button @click="view_tenants_from_payments(tempShowProperty)" class="view_tenants_button">
                            View Tenants List</button>
                    </div>
                </div>

                <div>
                    <table style="width: 100%;">
                        <caption>
                            <h2>Payments Details for {{ showPayments }} </h2>
                        </caption>
                        <tr class="table_header">
                            <th class="property_name">Property Name </th>
                            <th class="landlord_contact">Contact </th>
                            <th class="commision">Commision</th>
                            <th class="payment_date">Payment Date</th>
                            <th class="payment_mode">Mode</th>
                            <th class="bank_name"> Bank Name</th>
                            <th class="account_number">Account Number</th>

                        </tr>
                        <tr class="house" v-for="property in filteredPaymentsList" :key="property.property_name">
                            <td class="property_name">{{ property.property_name }} </td>
                            <td class="owner_contact">{{ property.contact }} </td>
                            <td class="commision-due">{{ property.commision }}</td>
                            <td class="payment">{{ property.payment_date }}</td>
                            <td class="payment_mode"> {{ property.payment_mode }}</td>
                            <td class="bank_name"> {{ property.bank_name }}</td>
                            <td class="owner_account_number">{{ property.account_number }} </td>

                        </tr>

                        <tr class="totals_row">
                            <td colspan="7"></td>
                        </tr>

                    </table>
                </div>
                <div class="property_utility">
                    <div class="water_electricity">
                        <table style="width: 100%;">
                            <caption>
                                <h2> Water & Electricity Bills for {{ showPayments }} </h2>
                            </caption>
                            <tr class="table_header">
                                <th class="utility_name">Utility Name</th>
                                <th class="meter_number">Meter Number </th>
                                <th class="landlord_contact">Units </th>
                                <th class="commision">Ammount</th>
                                <th class="payment_date">Date</th>
                            </tr>
                            <tr class="house" v-for="property in filteredPaymentsList" :key="property.property_name">
                                <td class="payment_mode"> KPLC </td>
                                <td class="property_name">{{ property.kplc_meter }} </td>
                                <td class="owner_contact">{{ property.kplc_units }} </td>
                                <td class="commision-due">{{ property.kplc_amount }}</td>
                                <td class="payment">{{ property.payment_date }}</td>
                            </tr>
                            <tr class="house" v-for="property in filteredPaymentsList" :key="property.property_name">
                                <td class="payment_mode"> Water </td>
                                <td class="property_name">{{ property.water_meter }} </td>
                                <td class="owner_contact">{{ property.water_units }} </td>
                                <td class="commision-due">{{ property.water_amount }}</td>
                                <td class="payment">{{ property.payment_date }}</td>
                            </tr>

                            <tr class="totals_row">
                                <td colspan="7"></td>
                            </tr>

                        </table>
                    </div>
                    <div class="mri_bill">
                        <table style="width: 100%;">
                            <caption>
                                <h2> MRI Bills for {{ showPayments }} </h2>
                            </caption>
                            <tr class="table_header">
                                <th class="utility_name">Utility Name</th>
                                <th class="meter_number">KRA PIN </th>
                                <th class="landlord_contact">I-TAX Password </th>
                                <th class="commision">Units </th>
                                <th class="commision">Amount </th>
                                <th class="payment_date">Date </th>
                            </tr>
                            <tr class="house" v-for="property in filteredPaymentsList" :key="property.property_name">
                                <td class="payment_mode"> MRI </td>
                                <td class="property_name">{{ property.mri_kra_pin }} </td>
                                <td class="owner_contact">{{ property.mri_itax_pass }} </td>
                                <td class="owner_contact">{{ property.mri_units }} </td>
                                <td class="commision-due">{{ property.mri_amount }}</td>
                                <td class="payment">{{ property.payment_date }}</td>
                            </tr>
                            <tr class="totals_row">
                                <td colspan="6"></td>
                            </tr>

                        </table>
                    </div>
                    <div class="other_property_expenses">
                        <table style="width: 100%;">
                            <caption>
                                <h2> Expenses for {{ showPayments }} </h2>
                            </caption>
                            <tr class="table_header">
                                <th class="utility_name">Date</th>
                                <th class="meter_number">Type </th>
                                <th class="landlord_contact">Particulars </th>
                                <th class="commision">Amount </th>
                            </tr>
                            <tr class="house" v-for="property in filteredPaymentsList" :key="property.property_name">
                                <td class="owner_contact">{{ property.mri_itax_pass }} </td>
                                <td class="owner_contact">{{ property.mri_units }} </td>
                                <td class="commision-due">{{ property.mri_amount }}</td>
                                <td class="payment">{{ property.payment_date }}</td>
                            </tr>
                            <tr class="totals_row">
                                <td colspan="4"></td>
                            </tr>

                        </table>
                    </div>
                </div>
            </div>

        </template>

        <template v-if="showTenants">
            <div class="tenant_per_property" v-show="showingTenantsList == true">
                <div class="back_to_properties_list">
                    <button @click.prevent="back_to_properties_list" class="back_to_propeties_button">Back to Properties
                        List</button>
                </div>
                <div class="tenant">
                    <table style="width:100%">
                        <caption>
                            <h2>Tenants List for {{ showTenants || tempShowProperty }}</h2>
                        </caption>
                        <tr class="table_header">
                            <th class="hse_number">Hse Number: </th>
                            <th class="teenant_name">Tenant's name </th>
                            <th class="house_rate">Rate </th>
                            <th class="rent_paid">Rent Paid for current month </th>
                            <th class="tenant_number">Contact:</th>
                            <th class="alternative_number">Alternative number </th>
                            <th class="id_number">Id Number</th>
                            <th class="status">Status</th>
                            <th class="property_name">Tenant Statements </th>
                            <th class="property_name">Update Tenant Details </th>
                        </tr>
                        <tr class="house" v-for="hse in filteredTenantsList" :key="hse.hse_number">
                            <td class="hse_number">{{ hse.hse_number }} </td>
                            <td class="teenant_name">{{ hse.tenant_name }} </td>
                            <td class="house_rate">{{ hse.house_rate }} </td>
                            <td class="rent_paid">True </td>
                            <td class="tenant_number">{{ hse.tenant_number }} </td>
                            <td class="alternative_number">{{ hse.alternative_number }} </td>
                            <td class="id_number">{{ hse.id_number }} </td>
                            <td class="status">{{ hse.status }}</td>
                            <td class="view_tenant_statements">
                                <button @click="view_tenant_statements(hse.hse_number, hse.property_name)"
                                    class="view_tenants_button">
                                    Tenant Statements</button>
                            </td>
                            <td class="view_tenant__link">
                                <button @click="update_tenant(hse.hse_number)" class="view_tenants_button">
                                    Update Tenant</button>
                            </td>
                        </tr>

                        <tr class="totals_row">
                            <td colspan="9"></td>
                        </tr>

                    </table>
                </div>
            </div>
            <div class="tenant_per_property" v-show="showingTenantStatements == true">
                <div class="back_to_properties_list">
                    <button @click.prevent="back_to_tenants_list" class="back_to_propeties_button">Back to Tenants
                        List</button>
                </div>
                <div class="tenant">
                    <table style="width:100%">
                        <caption>
                            <h2>Tenant Statements for house number {{ tempShowTenant }}</h2>
                        </caption>
                        <tr class="table_header">
                            <th class="hse_number">Hse Number: </th>
                            <th class="teenant_name">Tenant's name </th>
                            <th class="house_rate">Rate </th>
                            <th class="rent_paid">Rent Paid </th>
                            <th class="unpaid_rent">Arrears</th>
                            <th class="deposit_held">Deposit Paid</th>
                            <th class="arrears">Arrears BF</th>
                            <th class="arrears_cf"> Arrears CF:</th>
                            <th class="tenant_number">Contact:</th>
                        </tr>
                        <tr class="house" v-for="hse in filteredTenantStatements" :key="hse.hse_number">
                            <td class="hse_number">{{ hse.hse_number }} </td>
                            <td class="teenant_name">{{ hse.tenant_name }} </td>
                            <td class="house_rate">{{ hse.house_rate }} </td>
                            <td class="rent_paid">{{ hse.rent_paid }}</td>
                            <td class="unpaid_rent">{{ hse.unpaid_rent }}</td>
                            <td class="deposit_held">{{ hse.deposit_held }}</td>
                            <td class="arrears"> {{ hse.arrears }}</td>
                            <td class="arrears_cf"> {{ hse.arrears_cf }}</td>
                            <td class="tenant_number">{{ hse.tenant_number }} </td>
                        </tr>

                        <tr class="totals_row">
                            <td colspan="3">Totals</td>
                            <td>{{ total_rent_collected }}</td>
                            <td>{{ total_unpaid_rent }}</td>
                            <td>{{ total_deposit_held }}</td>
                            <td>{{ total_arrears_bf }}</td>
                            <td>{{ total_arrears_cf }}</td>
                            <td></td>
                        </tr>

                    </table>
                </div>
            </div>
            <div class="update_tenant" v-if="showUpdateTenant">
                <div v-show="showingUpdateTenant">
                    <div class="back_to_properties_list">
                        <button @click.prevent="back_to_tenants_list" class="back_to_propeties_button">Back to Tenants
                            List</button>
                    </div>
                    <div class="tenant_updates_header">
                        <h2>Update details for House Number: {{ showUpdateTenant.hse_number }} for {{ showUpdateTenant }}
                        </h2>
                    </div>
                    <div class="update">
                        <div class="paid_in_full">
                            <div class="paid_in_full_header">
                                <h3>Full Payment</h3>
                            </div>
                            <div class="paid_in_full_form">
                                <form @submit.prevent="submit_full_rent">
                                    <select v-model="tenants_full_rent_form.hse_number" class="select">
                                        <option disabled value="">Please select one</option>
                                        <option>{{ showUpdateTenant.hse_number }}</option>
                                    </select>
                                    <select v-model="tenants_full_rent_form.payment_date" class="select">
                                        <option disabled value="">Please select one</option>
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
                                <form @submit.prevent="submit_full_rent">
                                    <select v-model="tenants_full_rent_form.hse_number" class="select">
                                        <option disabled value="">Please select one</option>
                                        <option>{{ showUpdateTenant.hse_number }}</option>
                                    </select>
                                    <select v-model="tenants_full_rent_form.payment_date" required class="select">
                                        <option disabled value="">Please select one</option>
                                        <option v-for="month in payment_months_options" :key="month">{{ month.month }}
                                        </option>
                                    </select>
                                    <input v-model="tenants_full_rent_form.rent_paid" placeholder="Input Amount">

                                    <button class="view_tenants_button submit_button">submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </template>
    </div>


</template>

<style scoped>
.select {
    border-radius: 2em;
    padding: 0.75em;
    margin-bottom: 2em;
    border: none;
    font-weight: bold;
    color: #000;
    background-color: rgb(145, 234, 228, 0.33);
    box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.75);
}
</style>