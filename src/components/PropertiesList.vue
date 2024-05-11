<script setup>
import { computed, ref, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import { usePropertiesList } from '../stores/properties.js'
import { useTenantsList } from '../stores/tenants.js'

const tenantsStore = useTenantsList()
const propertiesStore = usePropertiesList()
const isLoading = ref(true);

onMounted(async () => {
    try {
        propertiesStore.fetchProperties()
        tenantsStore.fetchTenants()
        tenantsStore.fetchTenantStatements()
        propertiesStore.fetchPropertiesStatements()
    } catch (error) {
        console.error('error fetching data:', error)
    } finally {
        isLoading.value = false;
    }
})

const tenants = tenantsStore.tenants
const tenants_statements = tenantsStore.tenants_statements
const properties = propertiesStore.properties
const properties_statements = propertiesStore.properties_statements
const temp_tenants_statements = ref([])
const temp_properties_statements = ref([])
const tenants_full_rent_form = tenantsStore.tenants_full_rent_form
const tenants_partial_rent_form = tenantsStore.tenants_partial_rent_form
const property_full_payment_form = propertiesStore.property_full_payment_form
const property_partial_payment_form = propertiesStore.property_full_payment_form
const update_payment_month_form = tenantsStore.update_payment_month_form
const now = new Date();
const current_payment_date = ref('April-2024')

const showTenants = ref([])
const showPayments = ref([])
const showTenantStatements = ref([])
const showUpdateTenant = ref([])
const showUpdateProperty = ref([])

const filteredTenantsList = ref([]);
const filteredTenantStatements = ref([])
const filteredUpdateTenant = ref([])
const filteredUpdateProperty = ref([])
const filteredPropertyStatements = ref([]);

const showingTenantsList = ref(false)
const showingPropertiesList = ref(true)
const showingTenantStatements = ref(false)
const showingPropertyStatements = ref(false)
const showingUpdateTenant = ref(false)
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

const total_commision = computed(() => {
    return properties.reduce((acc, item) => acc + item.commision, 0);
});

const total_rent_collected_per_property_per_month = computed(() => {
    let filteredPropertyTotalRentList = tenants_statements.filter((propertyTotalRent) => propertyTotalRent.property_name === "Stephen Miiri- SM")
    return filteredPropertyTotalRentList.reduce((acc, item) => acc + item.rent_paid, 0);
});

/*POC*/
const total_rent_collected = computed(() => {
    let filteredPropertyTotalRentList = tenants_statements.filter((propertyTotalRent) => propertyTotalRent.property_name === "Stephen Miiri- SM")
    return filteredPropertyTotalRentList.reduce((acc, item) => acc + item.rent_paid, 0);
});

const total_rent_collected_per_hse = computed(() => {
    return filteredTenantStatements.value.reduce((acc, item) => acc + item.rent_paid, 0);
});
/*
const total_rent_collected_per_property = computed(() => {
    return filteredPropertyStatements.value.reduce((acc, item) => acc + item.commision, 0);
});
/*
const total_rent_collected_per_property  = computed(() => {
    let total = 0;
    return total;
})


const total_rent_collected_per_property = computed((tenants_statements, key) => {
    let total = 0;
    tenants_statements.forEach(obj => {

    if (obj.hasOwnProperty(key)) {
        total += obj[key];
    }

    return total;
})
});*/

const total_unpaid_rent = computed(() => {
    return filteredTenantStatements.value.reduce((acc, item) => acc + item.unpaid_rent, 0);
});


const total_deposit_held = computed(() => {
    return filteredTenantStatements.value.reduce((acc, item) => acc + item.deposit_held, 0);
});

const total_arrears_cf = computed(() => {
    return filteredTenantStatements.value.reduce((acc, item) => acc + item.arrears_cf, 0);
});

const total_arrears_bf = computed(() => {
    return filteredTenantStatements.value.reduce((acc, item) => acc + item.arrears_bf, 0);
});


const back_to_tenants_list = () => {
    showingUpdateTenant.value = false
    showingTenantsList.value = true
    showingTenantStatements.value = false

}

const back_to_properties_list = () => {
    showingTenantsList.value = false
    showingPropertiesList.value = true
}

const from_property_statements = () => {
    showingPropertyStatements.value = false
    showingPropertiesList.value = true
}


const update_property_statements = (temp_properties_statements) => {
    showingPropertyStatements.value = false
    showingTenantsList.value = false
    showingUpdateProperty.value = true
    filteredUpdateProperty.value = filteredPropertyStatements.value.filter((property) => property.property_name === temp_properties_statements.property_name);
    showUpdateProperty.value = filteredPropertyStatements.value[0]
    propertiesStore.fetchPropertiesStatements()
}

const update_tenant = (tempShowTenant) => {
    showingUpdateTenant.value = true
    showingTenantsList.value = false
    filteredUpdateTenant.value = filteredTenantsList.value.filter((tenant) => tenant.hse_number === tempShowTenant.hse_number);
    showUpdateTenant.value = filteredUpdateTenant.value[0]
    tenantsStore.fetchTenantStatements()
}

const update_tenant_from_tenant_statements = (tempShowTenant) => {
    showingUpdateTenant.value = true
    showingTenantsList.value = false
    showingTenantStatements.value = false
    filteredUpdateTenant.value = filteredTenantsList.value.filter((tenant) => tenant.hse_number === tempShowTenant.hse_number);
    showUpdateTenant.value = filteredUpdateTenant.value[0]
    tenantsStore.fetchTenantStatements()
}

const view_tenant_statements = (hse) => {
    console.log(hse)
    tenantsStore.fetchTenantStatements()
    tempShowTenant.value = hse
    showingTenantStatements.value = true
    showingTenantsList.value = false
    filteredTenantStatements.value = tenants_statements.filter((tenant_statement) => tenant_statement.tenant_id === hse._id);
    /*  showTenantStatements.value = filteredTenantStatements.value*/
}

const view_tenant_list = (property) => {
    showTenants.value = property
    showingTenantsList.value = true
    showingPropertiesList.value = false
    filteredTenantsList.value = tenants.filter((tenant) => tenant.property_name === property.property_name);
}

const view_property_statements = (property) => {
    console.log(property)
    propertiesStore.fetchPropertiesStatements()
    showPayments.value = property
    tempShowProperty.value = property
    showingUpdateProperty.value = false
    showingPropertiesList.value = false
    showingPropertyStatements.value = true
    filteredPropertyStatements.value = properties_statements.filter((property_statement) => property_statement.property_id === property._id);

}

const view_tenant_statements_from_update_tenant = (hse) => {
    tenantsStore.fetchTenantStatements()
    tempShowTenant.value = hse
    showingTenantStatements.value = true
    showingUpdateTenant.value = false;
    filteredTenantStatements.value = tenants_statements.filter((tenant_statement) => tenant_statement.tenant_id === hse._id);

    /*  showTenantStatements.value = filteredTenantStatements.value*/
}

const submit_modified_property_statement = (property) => {
    let newPropertyStatement = {
        "property_id": property._id,
        "property_name": property.property_name,
        "total_rent_collected": total_rent_collected.value,
        "commision": property.commision,
        "payment_date": current_payment_date.value,
        "payment_mode": property.payment_mode,
        "bank_name": property.bank_name,
        "account_number": property.account_number,
        "kplc_meter": property.kplc_meter,
        "kplc_units": property.kplc_units,
        "kplc_amount": 0,
        "water_amount": 0,
        "water_meter": property.water_meter,
        "water_units": 0,
        "mri_kra_pin": property.mri_kra_pin,
        "mri_itax_pass": property.mri_itax_pass,
        "mri_units": 0,
        "mri_amount": 0
    }

    const existingStatement = properties_statements.find(item => item.payment_date === newPropertyStatement.payment_date && item.property_id == newPropertyStatement.property_id)

    if (property_full_payment_form.payment_date === current_payment_date.value) {
        if (!existingStatement && temp_properties_statements.value.length === 0) {
            propertiesStore.updatePropertyStatements(newPropertyStatement)
            temp_properties_statements.value.push(newPropertyStatement)
            propertiesStore.fetchPropertiesStatements()
            alert('property statement updated succesfully')
        } else if (!existingStatement && temp_properties_statements.value.length > 0) {
            if (temp_properties_statements._id) {
                propertiesStore.updatePartialStatements(newPropertyStatement)
                temp_properties_statements.value.push(newPropertyStatement)
                propertiesStore.fetchPropertiesStatements()
                alert('property statement patched succesfully')
            } else {
                alert('refresh the page to update non')
            }

        } else if (existingStatement) {
            let id = existingStatement._id
            let payload = {
                ...newPropertyStatement,
                _id: id
            }
            propertiesStore.updatePartialStatements(payload)
            temp_properties_statements.value.push(payload)
            propertiesStore.fetchPropertiesStatements()
            alert('property statement patched succesfully yap')
        }
    } else if (property_full_payment_form.payment_date !== current_payment_date.value) {
        alert('You are updating property statements for ' + current_payment_date.value + ' change current date to update rent for ' + property_full_payment_form.payment_date)
    } else {
        alert('Invalid input, check entries & try again')
    }


}


const submit_full_property_statement = (property) => {
    let newPropertyStatement = {
        "property_id": property._id,
        "property_name": property.property_name,
        "total_rent_collected": total_rent_collected.value,
        "commision": property.commision,
        "payment_date": current_payment_date.value,
        "payment_mode": property.payment_mode,
        "bank_name": property.bank_name,
        "account_number": property.account_number,
        "kplc_meter": property.kplc_meter,
        "kplc_units": property.kplc_units,
        "kplc_amount": 0,
        "water_amount": 0,
        "water_meter": property.water_meter,
        "water_units": 0,
        "mri_kra_pin": property.mri_kra_pin,
        "mri_itax_pass": property.mri_itax_pass,
        "mri_units": 0,
        "mri_amount": 0
    }

    const existingStatement = properties_statements.find(item => item.payment_date === newPropertyStatement.payment_date && item.property_id == newPropertyStatement.property_id)

    if (property_full_payment_form.payment_date === current_payment_date.value) {
        if (!existingStatement && temp_properties_statements.value.length === 0) {
            propertiesStore.updatePropertyStatements(newPropertyStatement)
            temp_properties_statements.value.push(newPropertyStatement)
            propertiesStore.fetchPropertiesStatements()
            alert('property statement updated succesfully')
        } else if (!existingStatement && temp_properties_statements.value.length > 0) {
            if (temp_properties_statements._id) {
                propertiesStore.updatePartialStatements(newPropertyStatement)
                temp_properties_statements.value.push(newPropertyStatement)
                propertiesStore.fetchPropertiesStatements()
                alert('property statement patched succesfully')
            } else {
                alert('refresh the page to update non')
            }

        } else if (existingStatement) {
            let id = existingStatement._id
            let payload = {
                ...newPropertyStatement,
                _id: id
            }
            propertiesStore.updatePartialStatements(payload)
            temp_properties_statements.value.push(payload)
            propertiesStore.fetchPropertiesStatements()
            alert('property statement patched succesfully yap')
        }
    } else if (property_full_payment_form.payment_date !== current_payment_date.value) {
        alert('You are updating property statements for ' + current_payment_date.value + ' change current date to update rent for ' + property_full_payment_form.payment_date)
    } else {
        alert('Invalid input, check entries & try again')
    }


}


const submit_full_rent = (showUpdateTenant) => {
    if (tenants_full_rent_form.hse_number == '' && tenants_full_rent_form.payment_date == '') {
        alert('Select valid house number & the payment date')
    } else if (tenants_full_rent_form.hse_number !== '' && tenants_full_rent_form.payment_date == '') {
        alert('Select a valid payment date')
    } else if (tenants_full_rent_form.hse_number == '' && tenants_full_rent_form.payment_date !== '') {
        alert('Select a valid house number')
    } else if (tenants_full_rent_form.hse_number !== '' && tenants_full_rent_form.payment_date !== '' && tenants_full_rent_form.payment_date == current_payment_date.value) {

        const newStatementItem = {
            "property_name": showUpdateTenant.property_name,
            "hse_number": tenants_full_rent_form.hse_number,
            "tenant_name": showUpdateTenant.tenant_name,
            "payment_date": tenants_full_rent_form.payment_date,
            "house_rate": showUpdateTenant.house_rate,
            "rent_paid": showUpdateTenant.house_rate,
            "unpaid_rent": 0,
            "arrears": 0,
            "arrears_bf": 0,
            "arrears_cf": 0,
            "tenant_number": "0729490094",
            "tenant_id": showUpdateTenant._id,
        }

        const existingStatement = tenants_statements.find(item => item.payment_date === newStatementItem.payment_date && item.tenant_id == newStatementItem.tenant_id)

        if (!existingStatement && temp_tenants_statements.value.length === 0) {
            tenantsStore.updateTenantStatements(newStatementItem)
            temp_tenants_statements.value.push(newStatementItem)
            alert('Full rent for house number ' + newStatementItem.hse_number + ' for ' + newStatementItem.payment_date + ' has been updated succesfully ')
        } else if (!existingStatement && temp_tenants_statements.value.length > 0) {
            if (tempShowTenant.value.arrears === 0) {
                alert('Rent for ' + current_payment_date.value + ' is fully paid')
            } else if (tempShowTenant.value.arrears > 0) {
                alert('Use partial rent tab to update partial rent')
            }

        }
        else if (existingStatement) {
            if (existingStatement.arrears === 0) {
                alert('Rent for ' + current_payment_date.value + ' is fully paid')
            } else if (existingStatement.arrears > 0) {
                alert('Use partial rent tab to update partial rent')
            }

        } else {
            alert('invalid input')
        }

    } else if (tenants_full_rent_form.hse_number !== '' && tenants_full_rent_form.payment_date !== '' && tenants_full_rent_form.payment_date !== current_payment_date.value) {
        alert('You are updating rent for ' + current_payment_date.value + ' change current date to update rent for ' + tenants_full_rent_form.payment_date)
    } else {
        alert('Invalid input, check entries & try again')
    }

}

const submit_partial_rent = (showUpdateTenant) => {
    if (tenants_partial_rent_form.hse_number !== '' && tenants_partial_rent_form.payment_date !== '' && tenants_partial_rent_form.payment_date == current_payment_date.value) {
        let newStatementItem = {
            "property_name": showUpdateTenant.property_name,
            "hse_number": tenants_partial_rent_form.hse_number,
            "tenant_name": showUpdateTenant.tenant_name,
            "payment_date": tenants_partial_rent_form.payment_date,
            "house_rate": showUpdateTenant.house_rate,
            "rent_paid": Number(tenants_partial_rent_form.rent_paid),
            "unpaid_rent": showUpdateTenant.house_rate - Number(tenants_partial_rent_form.rent_paid),
            "current_month_fully_paid": false,
            "arrears": showUpdateTenant.house_rate - Number(tenants_partial_rent_form.rent_paid),
            "arrears_bf": 0,
            "arrears_cf": 0,
            "tenant_number": "0729490094",
            "tenant_id": showUpdateTenant._id,
        }
        const existingStatement = tenants_statements.find(item => item.payment_date === newStatementItem.payment_date && item.property_name == newStatementItem.property_name && item.hse_number == newStatementItem.hse_number)

        if (!existingStatement && temp_tenants_statements.value.length === 0) {
            if (newStatementItem.rent_paid > newStatementItem.house_rate) {
                alert('Input an amount equal to or less than arrears for the month, arrears for the current month is KES: ' + showUpdateTenant.house_rate)
            } else if (newStatementItem.rent_paid === newStatementItem.house_rate) {
                tenantsStore.updateTenantStatements(newStatementItem)
                temp_tenants_statements.value.push(newStatementItem)
                alert('Rent for ' + current_payment_date + ' is fully paid')
            }
            else if (newStatementItem.rent_paid <= newStatementItem.house_rate && newStatementItem.rent_paid <= 0) {
                alert('Input an amount greater than 0')
            } else if (newStatementItem.rent_paid <= newStatementItem.house_rate && newStatementItem.rent_paid > 0) {
                tenantsStore.updateTenantStatements(newStatementItem)
                temp_tenants_statements.value.push(newStatementItem)
                alert('Partial rent for house number ' + newStatementItem.hse_number + ' for ' + newStatementItem.payment_date + ' has been updated succesfully ')
            }
        } else if (!existingStatement && temp_tenants_statements.value.length > 0) {
            if (temp_tenants_statements.value.arrears === 0) {
                alert('Rent for ' + current_payment_date.value + ' is fully paid')
            } else if (newStatementItem.rent_paid > temp_tenants_statements.value.arrears) {
                alert('Input an amount equal to or less than arrears for the month, arrears for the currennt month is KES: ' + existingStatement.arrears)
            } else if (temp_tenants_statements.value.arrears <= newStatementItem.rent_paid) {
                alert('Update us here finnaly')
            }

        }

        else if (existingStatement) {
            if (existingStatement.arrears === 0) {
                alert('Rent for ' + current_payment_date.value + ' is fully paid')
            } else if (existingStatement.arrears > 0) {
                if (existingStatement.arrears >= newStatementItem.rent_paid) {
                    let i = Number(existingStatement.rent_paid) + Number(tenants_partial_rent_form.rent_paid)
                    let arrears = existingStatement.house_rate - i
                    let newStatementItem = {
                        "property_name": existingStatement.property_name,
                        "hse_number": tenants_partial_rent_form.hse_number,
                        "tenant_name": existingStatement.tenant_name,
                        "payment_date": tenants_partial_rent_form.payment_date,
                        "house_rate": existingStatement.house_rate,
                        "rent_paid": Number(tenants_partial_rent_form.rent_paid),
                        "unpaid_rent": arrears,
                        "current_month_fully_paid": false,
                        "arrears": arrears,
                        "arrears_bf": 0,
                        "arrears_cf": 0,
                        "tenant_number": "0729490094",
                        "id": existingStatement.property_id
                    }
                    tenantsStore.updatePartialStatements(newStatementItem)
                    alert('update statement here 101010 PARTIAL UPDATE')

                    console.log(existingStatement)
                } else if (newStatementItem.rent_paid > existingStatement.arrears) {
                    alert('Input an amount equal to or less than arrears for the month, arrears for the currennt month is KES: ' + existingStatement.arrears)
                }

            }
        }

    } else if (tenants_partial_rent_form.hse_number !== '' && tenants_partial_rent_form.payment_date !== '' && tenants_partial_rent_form.payment_date !== current_payment_date.value) {
        alert('You are updating rent for ' + current_payment_date.value + ' change current date to update rent for ' + tenants_partial_rent_form.payment_date)
    }
    else {
        alert('Invalid input, check entries & try again')
    }

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

/*HTML*/
<template>
    <div class="loading_page" v-if="isLoading">
        <h1>Welcome To Top View Property Management dashboard</h1>
        <h4>We are getting resources ready</h4>
    </div>
    <div class="property_list" v-else>
        <template v-if="showPayments">
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
                        <th class="view_tenats">Tenants List</th>

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
                        <td class="commision-due"><button @click="view_property_statements(property)"
                                class="view_tenants_button">
                                Property Statements </button>
                        </td>
                        <td class="view_tenant_link">
                            <button @click="view_tenant_list(property)" class="view_tenants_button">
                               View Tenants List</button>
                        </td>

                    </tr>

                    <tr class="totals_row">
                        <td colspan="6"></td>
                    </tr>

                </table>
            </div>

            <div class="payment_details" v-show="showingPropertyStatements">
                <div class="payment_datils_nav">
                    <div class="back_to_properties_list">
                        <button @click.prevent="from_property_statements" class="back_to_propeties_button">Back to
                            Properties
                            List</button>
                    </div>
                    <div class="back_to_properties_list">
                        <button @click="update_property_statements(showPayments)" class="view_tenants_button">
                            Update Property Statements</button>
                    </div>
                </div>

                <div>
                    <table style="width: 100%;">
                        <caption>
                            <h2>Property Statements for {{ showPayments.property_name }} </h2>
                        </caption>
                        <tr class="table_header">
                            <th class="property_name">Property Name </th>
                            <th class="total_rent_paid">Total Rent Paid</th>
                            <th class="commision">Commision</th>
                            <th class="payment_date">Payment Date</th>
                            <th class="payment_mode">Mode</th>
                            <th class="bank_name"> Bank Name</th>
                            <th class="account_number">Account Number</th>

                        </tr>
                        <tr class="house" v-for="property in filteredPropertyStatements" :key="property._id">
                            <td class="property_name">{{ property.property_name }} </td>
                            <td class="total_rent_paid">0</td>
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
                                <h2> Water & Electricity Bills for {{ showPayments.property_name }} </h2>
                            </caption>
                            <tr class="table_header">
                                <th class="utility_name">Utility Name</th>
                                <th class="meter_number">Meter Number </th>
                                <th class="landlord_contact">Units </th>
                                <th class="commision">Ammount</th>
                                <th class="payment_date">Date</th>
                            </tr>
                            <tr class="house" v-for="property in filteredPropertyStatements" :key="property._id">
                                <td class="payment_mode"> KPLC </td>
                                <td class="property_name">{{ property.kplc_meter }} </td>
                                <td class="owner_contact">{{ property.kplc_units }} </td>
                                <td class="commision-due">{{ property.kplc_amount }}</td>
                                <td class="payment">{{ property.payment_date }}</td>
                            </tr>
                            <tr class="house" v-for="property in filteredPropertyStatements" :key="property._id">
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
                                <h2> MRI Bills for {{ showPayments.property_name }} </h2>
                            </caption>
                            <tr class="table_header">
                                <th class="utility_name">Utility Name</th>
                                <th class="meter_number">KRA PIN </th>
                                <th class="landlord_contact">I-TAX Password </th>
                                <th class="commision">Units </th>
                                <th class="commision">Amount </th>
                                <th class="payment_date">Date </th>
                            </tr>
                            <tr class="house" v-for="property in filteredPropertyStatements" :key="property._id">
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
                                <h2> Expenses for {{ showPayments.property_name }} </h2>
                            </caption>
                            <tr class="table_header">
                                <th class="utility_name">Date</th>
                                <th class="meter_number">Type </th>
                                <th class="landlord_contact">Particulars </th>
                                <th class="commision">Amount </th>
                            </tr>
                            <tr class="house" v-for="property in filteredPropertyStatements" :key="property._">
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

            <div class="update_property" v-show="showingUpdateProperty">
                <div>
                    <div class="update_property_header">
                        <div class="update_property_header_nav">
                            <div class="back_to_properties_list">
                                <button @click.prevent="view_property_statements_from_update_property(showPayments)"
                                    class="back_to_propeties_button">Back to
                                    Property Statements
                                    List</button>
                            </div>

                            <div class="back_to_properties_list">
                                <button @click.prevent="view_property_statements_from_update_property(showPayments)"
                                    class="back_to_propeties_button">View Property
                                    Statements
                                </button>
                            </div>
                        </div>
                        <div class="tenant_updates_header">
                            <div class="tenant_updates_header_title">
                                <h2>Update Property Statements</h2>
                            </div>
                            <div class="poperty_statement_details">
                                <h3> <span>Property Name: </span>{{ showPayments.property_name }}</h3>

                                <div class="change_current_month_properties">
                                    <h3> <span>Current Payment Month: </span>{{ current_payment_date }}</h3>
                                    <form
                                        @submit.prevent="change_current_month(update_payment_month_form.payment_date)">
                                        <h3 style="color: #52319d;">Change the Payment Month</h3>
                                        <select v-model="update_payment_month_form.payment_date" required
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
                    <div class="update">
                        <div class="paid_in_full">
                            <div class="paid_in_full_header">
                                <h3>Update full Property Statement</h3>
                            </div>
                            <div class="paid_in_full_form">
                                <form @submit.prevent="submit_full_property_statement(showPayments)">
                                    Month: <select v-model="property_full_payment_form.payment_date" required
                                        class="select">
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
                            <div class="tenant_paid_in_full_form">
                                <form @submit.prevent="submit_modified_property_statement(showUpdateProperty)">
                                    House No:<select v-model="property_partial_payment_form.property_name" required
                                        class="select">
                                        <option disabled value="">Please select house number</option>
                                        <option>{{ showUpdateTenant.hse_number }}</option>
                                    </select>
                                    Month: <select v-model="tenants_partial_rent_form.payment_date" required
                                        class="select">
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

        <template v-if="showTenants">
            <div class="tenant_per_property" v-show="showingTenantsList == true">
                <div class="back_to_properties_list">
                    <button @click.prevent="back_to_properties_list" class="back_to_propeties_button">Back to Properties
                        List</button>
                </div>
                <div class="tenant">
                    <table style="width:100%">
                        <caption>
                            <h2>Tenants List for {{ showTenants.property_name }}</h2>
                        </caption>
                        <tr class="table_header">
                            <th class="hse_number">Hse Number: </th>
                            <th class="tenant_name">Tenant's name </th>
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
                            <td class="tenant_name">{{ hse.tenant_name }} </td>
                            <td class="house_rate">{{ hse.house_rate }} </td>
                            <td class="rent_paid">{{ hse.current_month_fully_paid }} </td>
                            <td class="tenant_number">{{ hse.tenant_number }} </td>
                            <td class="alternative_number">{{ hse.alternative_number }} </td>
                            <td class="id_number">{{ hse.id_number }} </td>
                            <td class="status">{{ hse.status }}</td>
                            <td class="view_tenant_statements">
                                <button @click="view_tenant_statements(hse)" class="view_tenants_button">
                                    Tenant Statements</button>
                            </td>
                            <td class="view_tenant__link">
                                <button @click="update_tenant(hse)" class="view_tenants_button">
                                    Update Tenant</button>
                            </td>
                        </tr>

                        <tr class="totals_row">
                            <td colspan="10"></td>
                        </tr>

                    </table>
                </div>
            </div>
            <div class="tenant_per_property" v-show="showingTenantStatements == true">
                <div class="payment_datils_nav">
                    <div class="back_to_properties_list">
                        <button @click.prevent="back_to_tenants_list" class="back_to_propeties_button">Back to Tenants
                            List
                        </button>
                    </div>
                    <div class="back_to_properties_list">
                        <button @click.prevent="update_tenant_from_tenant_statements(tempShowTenant)"
                            class="back_to_propeties_button">
                            Update Tenant
                        </button>
                    </div>
                </div>
                <div class="tenant">
                    <table style="width:100%; display: none" ref="pdfContent">
                        <caption>
                            <h2>Tenant Statements for house number {{ tempShowTenant.hse_number }}</h2>
                        </caption>
                        <tr class="table_header">
                            <th class="hse_number">Hse Number: </th>
                            <th class="tenant_name">Tenant's name </th>
                            <th class="payment_date">Payment Date </th>
                            <th class="house_rate">Rate </th>
                            <th class="rent_paid">Rent Paid </th>
                            <th class="unpaid_rent">Arrears</th>
                            <th class="arrears">Arrears BF</th>
                            <th class="arrears_cf"> Arrears CF:</th>
                            <th class="tenant_number">Contact:</th>
                        </tr>
                        <tr class="house" v-for="hse in filteredTenantStatements" :key="hse.hse_number">
                            <td class="hse_number">{{ hse.hse_number }} </td>
                            <td class="tenant_name">{{ hse.tenant_name }} </td>
                            <td class="payment_date">{{ hse.payment_date }} </td>
                            <td class="house_rate">{{ hse.house_rate }} </td>
                            <td class="rent_paid">{{ hse.rent_paid }}</td>
                            <td class="arrears"> {{ hse.arrears }}</td>
                            <td class="unpaid_rent">{{ hse.arrears_bf }}</td>
                            <td class="arrears_cf"> {{ hse.arrears_cf }}</td>
                            <td class="tenant_number">{{ hse.tenant_number }} </td>
                        </tr>

                        <tr class="totals_row">
                            <td colspan="4">
                                <div class="totals"> Totals</div>
                            </td>
                            <td>{{ total_rent_collected }}</td>
                            <td>{{ total_unpaid_rent }}</td>
                            <td>{{ total_arrears_bf }}</td>
                            <td>{{ total_arrears_cf }}</td>
                            <td></td>
                        </tr>

                    </table>

                  
                    
                </div>

                <div class="tenant tenant_statement_download" id="tenant_statement_download">
                    <div class="tenant_statement_download_header">
                        <div class="logo_wrap logo_wrap_statement_download ">
                            <img alt="Vue logo" class="logo" src="/logo-bg.png" width="300" height="300" />
                        </div>
                        <div class="tenant_statement_header_items">
                            <h2>Tenant Statements for house number {{ tempShowTenant.hse_number }}</h2>
                            <h2>Property Name: {{ tempShowTenant.property_name }}</h2>
                            <h3>{{ now }}</h3>
                        </div>
                    </div>

                    <table style="width:100%" ref="pdfContent">

                        <tr class="table_header">
                            <th class="hse_number">Hse Number: </th>
                            <th class="tenant_name">Tenant's name </th>
                            <th class="payment_date">Payment Date </th>
                            <th class="house_rate">Rate </th>
                            <th class="rent_paid">Rent Paid </th>
                            <th class="unpaid_rent">Arrears</th>
                            <th class="arrears">Arrears BF</th>
                            <th class="arrears_cf"> Arrears CF:</th>
                            <th class="tenant_number">Contact:</th>
                        </tr>
                        <tr class="house" v-for="hse in filteredTenantStatements" :key="hse.hse_number">
                            <td class="hse_number">{{ hse.hse_number }} </td>
                            <td class="tenant_name">{{ hse.tenant_name }} </td>
                            <td class="payment_date">{{ hse.payment_date }} </td>
                            <td class="house_rate">{{ hse.house_rate }} </td>
                            <td class="rent_paid">{{ hse.rent_paid }}</td>
                            <td class="arrears"> {{ hse.arrears }}</td>
                            <td class="unpaid_rent">{{ hse.arrears_bf }}</td>
                            <td class="arrears_cf"> {{ hse.arrears_cf }}</td>
                            <td class="tenant_number">{{ hse.tenant_number }} </td>
                        </tr>

                        <tr class="totals_row">
                            <td colspan="4">
                                <div class="totals"> Totals</div>
                            </td>
                            <td>{{ total_rent_collected_per_hse }}</td>
                            <td>{{ total_unpaid_rent }}</td>
                            <td>{{ total_arrears_bf }}</td>
                            <td>{{ total_arrears_cf }}</td>
                            <td></td>
                        </tr>

                    </table>
                    
                </div>

                <div class="download_button_wrap">
                        <button @click='download_tenant_statement(tempShowTenant)' class="back_to_propeties_button">Download
                        Tenant Statements</button>    
                    </div>
            </div>
            <div class="update_tenant" v-if="showUpdateTenant">
                <div v-show="showingUpdateTenant">
                    <div class="update_tenant_header">
                    
                        <div class="update_property_header_nav">
                            <div class="back_to_properties_list">
                                <button @click.prevent="back_to_tenants_list" class="back_to_propeties_button">Back to
                                    Tenants
                                    List</button>
                            </div>

                            <div class="back_to_properties_list">
                            <button @click.prevent="view_tenant_statements_from_update_tenant(showUpdateTenant)"
                                class="back_to_propeties_button">View Tenant
                                Statements</button>
                            </div>
                        </div>

                        <div class="tenant_updates_header">
                            <table style="width: 100%;">
                                <caption>
                                    <h2>You are Updating Rent Status For: {{ current_payment_date }}</h2>
                                </caption>
                                <tr class="table_header">
                                    <th class="property_name">Property Name </th>
                                    <th class="hse_number">Hse Number: </th>
                                    <th class="tenant_name">Tenant's name </th>
                                    <th class="house_rate">Rate </th>

                                </tr>
                                <tr class="house">
                                    <td class="property_name">{{ showUpdateTenant.property_name }}</td>
                                    <td class="hse_number">{{ showUpdateTenant.hse_number }}</td>
                                    <td class="tenant_name"> {{ showUpdateTenant.tenant_name }}</td>
                                    <td class="house_rate">{{ showUpdateTenant.house_rate }}</td>

                                </tr>

                                <tr class="totals_row">
                                    <td colspan="4"></td>
                                </tr>

                            </table>
                        </div>

                        <div class="change_current_month">

                            <div class="poperty_statement_details">

                                <div class="change_current_month_properties">
                                    <h3> <span>Current Payment Month: </span>{{ current_payment_date }}</h3>
                                    <form
                                        @submit.prevent="change_current_month(update_payment_month_form.payment_date)">
                                        <h3 style="color: #52319d;">Change the Payment Month</h3>
                                        <select v-model="update_payment_month_form.payment_date" required
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
                    <div class="update">
                        <div class="paid_in_full">
                            <div class="paid_in_full_header">
                                <h3>Full Payment</h3>
                            </div>
                            <div class="paid_in_full_form">
                                <form @submit.prevent="submit_full_rent(showUpdateTenant)">
                                    House No: <select v-model="tenants_full_rent_form.hse_number" required
                                        class="select">
                                        <option disabled value="">Please select house number</option>
                                        <option>{{ showUpdateTenant.hse_number }}</option>
                                    </select>
                                    Month: <select v-model="tenants_full_rent_form.payment_date" required
                                        class="select">
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
                                <form @submit.prevent="submit_partial_rent(showUpdateTenant)">
                                    House No:<select v-model="tenants_partial_rent_form.hse_number" required
                                        class="select">
                                        <option disabled value="">Please select house number</option>
                                        <option>{{ showUpdateTenant.hse_number }}</option>
                                    </select>
                                    Month: <select v-model="tenants_partial_rent_form.payment_date" required
                                        class="select">
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
    </div>


</template>

<style scoped>
/*
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

.tenant_updates_header h4 {
    padding-bottom: 1em;
    font-weight: bold;
}*/
</style>