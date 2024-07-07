<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import { usePropertiesList } from '../stores/properties.js'
import { useTenantsList } from '../stores/tenants.js'
import { Store } from 'vuex';

const tenantsStore = useTenantsList()
const propertiesStore = usePropertiesList()
const isLoading = ref(true);

onMounted(async () => {
    try {
        propertiesStore.fetchProperties()
        tenantsStore.fetchTenants()
        tenantsStore.fetchTenantStatements()
        tenantsStore.fetchTerminatedTenants()
        propertiesStore.fetchPropertiesStatements()
    } catch (error) {
        console.error('error fetching data:', error)
    } finally {
        isLoading.value = false;
    }
})

const tenants = ref(tenantsStore.tenants)
const tenants_statements = ref(tenantsStore.tenants_statements)
const properties = ref(propertiesStore.properties)
const properties_statements = ref(propertiesStore.properties_statements)
const temp_tenants_statements = ref([])
const temp_properties_statements = ref([])
const tenants_full_rent_form = ref(tenantsStore.tenants_full_rent_form)
const tenants_partial_rent_form = ref(tenantsStore.tenants_partial_rent_form)
const property_full_payment_form = ref(propertiesStore.property_full_payment_form)
const property_partial_payment_form = ref(propertiesStore.property_full_payment_form)
const update_payment_month_form = ref(tenantsStore.update_payment_month_form)
const now = new Date();
const current_payment_date = ref('April-2024')
const error = ref('');
const formFields = ref(propertiesStore.formFields)
const filterTenantsStatements = ref(tenantsStore.filterTenantsStatements())
const other_income_list = ref([])
const property_expense_list = ref([])


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
const filteredPropertyStatementsPerMonth = ref([]);

const showingTenantsList = ref(false)
const showingPropertiesList = ref(true)
const showingTenantStatements = ref(false)
const showingPropertyStatements = ref(false)
const showingUpdateTenant = ref(false)
const showingUpdateProperty = ref(false)
const showingAddHouse = ref(false)
const showingAddProperty = ref(false)
const showingPropertyPaymentMonths = ref(false)

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

const house_status = ref([
    { status: 'Occupied' },
    { status: 'Vacant' }
])

const tempShowProperty = ref([])
const tempShowTenant = ref([])
const loading = propertiesStore.loading

const total_commision = computed(() => {
    return properties.reduce((acc, item) => acc + item.commision, 0);
});

const total_rent_collected_per_property_per_month = computed(() => {
    let filteredPropertyTotalRentList = tenants_statements.value.filter((propertyTotalRent) => propertyTotalRent.property_name === showPayments.value.property_name)
    return filteredPropertyTotalRentList.reduce((acc, item) => acc + item.rent_paid, 0);
});

const getFilterTenantsStatements = (hse_number, payment_date) => {
    return tenantsStore.filterTenantsStatements(hse_number, payment_date)
};

/*
const total_rent_collected_per_tenant_active_month = computed(() => {
    let filteredPropertyTotalRentList = tenants_statements.value.filter((propertyTotalRent) => propertyTotalRent.property_name === showPayments.value.property_name && )
    return filteredPropertyTotalRentList.reduce((acc, item) => acc + item.rent_paid, 0);
});*/

/*POC*/
const total_rent_collected = computed(() => {
    let filteredPropertyTotalRentList = tenants_statements.value.filter((propertyTotalRent) => propertyTotalRent.property_name === "Stephen Miiri- SM")
    return filteredPropertyTotalRentList.reduce((acc, item) => acc + item.rent_paid, 0);
});

const total_rent_collected_per_hse = computed(() => {
    return filteredTenantStatements.value.reduce((acc, item) => acc + item.rent_paid, 0);
});

const total_rent_collected_per_property = computed(() => {
    return filteredPropertyStatementsPerMonth.value.reduce((acc, item) => acc + item.rent_paid, 0);
});

const total_other_deposit_per_property = computed(() => {
    return other_income_list.value.reduce((acc, item) => acc + Number(item.deposit_held), 0);
});

const total_other_income_per_property = computed(() => {
    return other_income_list.value.reduce((acc, item) => acc + Number(item.income_amount), 0);
});

const total_arrears_per_property = computed(() => {
    return filteredPropertyStatementsPerMonth.value.reduce((acc, item) => acc + item.arrears, 0);
});

const total_arrears_bf_per_property = computed(() => {
    return filteredPropertyStatementsPerMonth.value.reduce((acc, item) => acc + item.arrears_bf, 0);
});

const total_arrears_paid_per_property = computed(() => {
    return filteredPropertyStatementsPerMonth.value.reduce((acc, item) => acc + item.arrears_paid, 0);
});

const total_arrears_cf_per_property = computed(() => {
    return filteredPropertyStatementsPerMonth.value.reduce((acc, item) => acc + item.arrears_cf, 0);
});

const property_gross_pay = computed(() => {
    return (total_arrears_per_property.value || 0) + (total_rent_collected_per_property.value || 0) + (total_other_income_per_property.value || 0) + (total_other_deposit_per_property.value || 0)
})


const property_total_deductions = computed(() =>{
    let x = property_monthly_deductions
    return ((Number(x.commision) || 0) + (Number(x.deposit_refund) || 0) + (Number(x.overpayment) || 0) + (Number(x.paid_to_landlord) || 0) + (Number(x.expense_amount) || 0))
})

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
    return filteredTenantStatements.value.reduce((acc, item) => acc + item.arrears, 0);
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
    filteredTenantStatements.value = tenants_statements.value.filter((tenant_statement) => tenant_statement.tenant_id === hse._id);
    /*  showTenantStatements.value = filteredTenantStatements.value*/
}

const view_tenant_list = (property) => {
    showTenants.value = property
    showingTenantsList.value = true
    showingPropertiesList.value = false
    filteredTenantsList.value = tenants.value.filter((tenant) => tenant.property_name === property.property_name);
}

const view_property_statements = (property) => {
    console.log(property)
    propertiesStore.fetchPropertiesStatements()
    showPayments.value = property
    tempShowProperty.value = property
    showingUpdateProperty.value = false
    showingPropertiesList.value = false
    showingPropertyPaymentMonths.value = true
    showingPropertyStatements.value = true
    filteredPropertyStatements.value = properties_statements.value.filter((property_statement) => property_statement.property_id === property._id);

}

const property_per_month_statement = (property, month) => {
    showingPropertyPaymentMonths.value = false;
    filteredPropertyStatementsPerMonth.value = tenants_statements.value.filter((tenant_statement) => tenant_statement.property_name === property.property_name && tenant_statement.payment_date === month)
    filteredTenantsList.value = tenants.value.filter((tenant) => tenant.property_name === property.property_name);
    console.log(filteredPropertyStatementsPerMonth.value)
}

const view_tenant_statements_from_update_tenant = (hse) => {
    tenantsStore.fetchTenantStatements()
    tempShowTenant.value = hse
    showingTenantStatements.value = true;
    showingUpdateTenant.value = false;
    filteredTenantStatements.value = tenants_statements.value.filter((tenant_statement) => tenant_statement.tenant_id === hse._id);

    /*  showTenantStatements.value = filteredTenantStatements.value*/
}
const view_property_statements_from_update_property = (property) => {
    propertiesStore.fetchPropertiesStatements
    tempShowProperty.value = property
    showingPropertyStatements.value = true;
    showingUpdateProperty.value = false;
    showingPropertyPaymentMonths.value = true;
    filteredPropertyStatements.value = properties_statements.value.filter((property_statement) => property_statement.property_id === property._id);
}

const back_to_tenants_list_from_add_house = () => {
    showingAddHouse.value = false
}

const back_to_properties_list_from_add_property = () => {
    showingAddProperty.value = false
}

const view_add_new_property = () => {
    showingAddProperty.value = true

}

const view_add_new_house = () => {
    showingAddHouse.value = true

}

const formValues = reactive({
    kplc_amount: '',
    kplc_units: '',
    water_amount: '',
    water_units: '',
    mri_amount: '',
    mri_units: ''
});

const formErrors = reactive({
    kplc_amount: '',
    kplc_units: '',
    water_amount: '',
    water_units: '',
    mri_amount: '',
    mri_units: ''
});

const add_property_form_values = reactive({
    landlord_name: '',
    contact: '',
    property_name: '',
    property_location: '',
    payment_mode: '',
    bank_name: '',
    account_number: '',
    kplc_meter: '',
    water_meter: '',
    mri_kra_pin: '',
    mri_itax_pass: ''
});

const add_property_formFields = reactive({
    landlord_name: {
        label: "Landlord Name :",
        placeholder: "Please Input landlord name",
    },
    contact: {
        label: "Contact :",
        placeholder: "Please Input landlord contact",
    },
    property_name: {
        label: "Property Name :",
        placeholder: "Please Input Property Name ",
    },
    property_location: {
        label: "Property Location :",
        placeholder: "Please Input Property Location",
    },
    payment_mode: {
        label: "Payment Mode :",
        placeholder: "Please Input Payment Mode",
    },
    bank_name: {
        label: "Bank Name :",
        placeholder: "Please Input Bank Name",
    },
    account_number: {
        label: "Account Number :",
        placeholder: "Please Input Account Number",
    },
    kplc_meter: {
        label: "KPLC Meter :",
        placeholder: "Please Input KPLC Meter",
    },
    water_meter: {
        label: "Water Meter :",
        placeholder: "Please Input Water Meter",
    },
    mri_kra_pin: {
        label: "MRI KRA PIN :",
        placeholder: "Please Input MRI KRA PIN",
    },
    mri_itax_pass: {
        label: "MRI Itax PIN :",
        placeholder: "Please Input MRI Itax PIN",
    },
})

const property_other_statement_form_values = reactive({
    expense_name: '',
    contact: '',
    expense_id: '',
    deposit: null,
    house_number: '',
    income_amount: null,
    income_name: ''
})

const property_monthly_deductions = reactive({
    commision: null,
    overpayment: null,
    paid_to_landlord: null,
    deposit_held: null,
    deposit_refund: null,
    house_number: '',
    expense_name: '',
    expense_amount: null
})

const property_monthly_deductions_form_errors = reactive({
    commision: '',
    overpayment: '',
    paid_to_landlord: '',
    deposit_held: '',
    deposit_refund: '',
    house_number: '',
    expense_name: ''
})

const populatedFields = computed(() => {
    return Object.entries(property_monthly_deductions).filter(([key, value]) => value !== '' && value !== null);
});



const property_other_statement_form_errors = reactive({
    expense_name: '',
    contact: '',
    expense_id: '',
    deposit: '',
    house_number: ''
})

const property_other_statement_formFields = reactive({
    expense_name: {
        label: "Expense Name ",
        placeholder: "Please Input Expense name",
    },
    expense_amount: {
        label: "Expense Amount  ",
        placeholder: "Please Input Expense Amount ",
    }
})

const add_property_form_errors = reactive({
    landlord_name: '',
    contact: '',
    property_name: '',
    property_location: '',
    payment_mode: '',
    bank_name: '',
    account_number: '',
    kplc_meter: '',
    water_meter: '',
    mri_kra_pin: '',
    mri_itax_pass: ''
});

const add_house_form_errors = reactive({
    landlord_name: '',
    contact: '',
    property_name: '',
    property_location: '',
    payment_mode: '',
    bank_name: '',
    account_number: '',
    kplc_meter: '',
    water_meter: '',
    mri_kra_pin: '',
    mri_itax_pass: ''
});

const add_tenant_form_values = reactive({
    property_name: '',
    hse_number: '',
    tenant_name: '',
    house_rate: '',
    deposit_held: 0,
    contact: '',
    alternative_contact: '',
    id_number: '',
    status: ''
});

const add_house_form_values = reactive({
    property_name: '',
    hse_number: '',
    tenant_name: '',
    house_rate: '',
    deposit_held: '',
    contact: '',
    alternative_contact: '',
    id_number: '',
    status: '',
    rent_paid_for_current_month: true
});

const add_tenant_formFields = reactive({
    tenant_name: {
        label: "Tenant Name :",
        placeholder: "Please Input Tenant Name ",
    },
    house_rate: {
        label: "House Rate :",
        placeholder: "Please Input House Rate NUMBERS ONLY",
    },
    deposit_held: {
        label: "Deposit Held :",
        placeholder: "Please Input Deposit Held",
    },
    contact: {
        label: "Tenant Contact :",
        placeholder: "Please Input Tenant Contact",
    },
    alternative_contact: {
        label: "Alternative Number :",
        placeholder: "Please provide Alternative Number",
    },
    id_number: {
        label: "Tenant ID Number :",
        placeholder: "Please Input Tenant ID Number",
    }
})

const add_house_formFields = reactive({
    hse_number: {
        label: "House Number :",
        placeholder: "Please Input House Number",
    },
    tenant_name: {
        label: "Tenant Name :",
        placeholder: "Please Input Tenant Name ",
    },
    house_rate: {
        label: "House Rate :",
        placeholder: "Please Input House Rate NUMBERS ONLY",
    },
    deposit_held: {
        label: "Deposit Held :",
        placeholder: "Please Input Deposit Held",
    },
    contact: {
        label: "Tenant Contact :",
        placeholder: "Please Input Tenant Contact",
    },
    alternative_contact: {
        label: "Alternative Number :",
        placeholder: "Please provide Alternative Number",
    },
    id_number: {
        label: "Tenant ID Number :",
        placeholder: "Please Input Tenant ID Number",
    }
})

const add_tenant_form_errors = reactive({
    property_name: '',
    hse_number: '',
    tenant_name: '',
    house_rate: '',
    deposit_held: '',
    contact: '',
    alternative_contact: '',
    id_number: '',
    status: ''
});


/*
const validateInput = (field) => {
    const regex = /^[0-9]*$/;
    if (!regex.test(formValues[field])) {
        formErrors[field] = 'Please enter a valid number.';
    } else {
        formErrors[field] = '';
    }
    formValues[field] = formValues[field].replace(/[^0-9]/g, '');
};*/

const add_new_property = () => {
    let hasErrors = false;
    console.log(add_property_form_values)
    const existingProperty = properties.value.find(property => property.property_name === add_property_form_values.property_name && property.property_name === add_property_form_values.property_name)
    if (existingProperty) {
        alert('property with the given name already exists')
    } else if (!existingProperty) {
        propertiesStore.addNewProperty(add_property_form_values)
        properties.value.push(add_property_form_values)
    }
}

const add_new_tenant = (tenant) => {
    let new_tenant = {
        ...tenant,
        hse_number: add_tenant_form_values.hse_number,
        property_name: add_tenant_form_values.property_name,
        status: add_tenant_form_values.status,
        rent_paid_for_current_month: true
    }

    const existingTenant = tenants.value.find(tenant => tenant.property_name === new_tenant.property_name && tenant.hse_number === new_tenant.hse_number)
    if (existingTenant) {
        let modify_tenant = {
            ...new_tenant,
            _id: existingTenant._id
        }
        tenantsStore.addNewTenant(modify_tenant)
        function modifyObject() {
            let item = filteredTenantsList.value.find((tenant) => tenant._id === modify_tenant._id);
            if (item) {
                const index = filteredTenantsList.value.findIndex(tenant => tenant._id === item._id);
                alert(index)
                filteredTenantsList.value[index] = modify_tenant
                //item = modify_tenant;*/
            }
        }
        modifyObject()
        alert('House number ' + existingTenant.hse_number + " for " + existingTenant.property_name + " already exists")
    } else {
        alert("modify tenant")
    }
}

const add_new_house = (tenant) => {
    let new_tenant = {
        ...tenant,
        property_name: add_house_form_values.property_name,
        status: add_house_form_values.status,
        rent_paid_for_current_month: true
    }

    const existingTenant = tenants.value.find(tenant => tenant.property_name === new_tenant.property_name && tenant.hse_number === new_tenant.hse_number)
    if (existingTenant) {
        alert('House number ' + existingTenant.hse_number + " for " + existingTenant.property_name + " already exists")
    } else {
        tenantsStore.addNewHouse(new_tenant)
        tenants.value.push(new_tenant)
    }

}

const submit_modified_property_statement = (property) => {
    let hasErrors = false;
    let newPropertyStatement = {
        "property_id": property._id,
        "property_name": property.property_name,
        "total_rent_collected": total_rent_collected.value,
        "commision": 6000,
        "payment_date": property_partial_payment_form.value.payment_date,
        "payment_mode": property.payment_mode,
        "bank_name": property.bank_name,
        "account_number": property.account_number,
        "kplc_meter": property.kplc_meter,
        "kplc_units": property_partial_payment_form.value.kplc_units,
        "kplc_amount": property_partial_payment_form.value.kplc_amount,
        "water_amount": property_partial_payment_form.value.water_amount,
        "water_meter": property.water_meter,
        "water_units": property_partial_payment_form.value.water_units,
        "mri_kra_pin": property.mri_kra_pin,
        "mri_itax_pass": property.mri_itax_pass,
        "mri_units": property_partial_payment_form.value.mri_units,
        "mri_amount": property_partial_payment_form.value.mri_amount
    }

    /* Object.keys(formValues).forEach((field) => {
         validateInput(field);
         if (formErrors[field]) {
             hasErrors = true;
         }
     });*/

    const existingStatement = properties_statements.value.find(item => item.payment_date === newPropertyStatement.payment_date && item.property_id == newPropertyStatement.property_id)

    if (property_full_payment_form.value.payment_date === current_payment_date.value) {
        if (!hasErrors.value) {
            if (!existingStatement && temp_properties_statements.value.length === 0) {
                propertiesStore.updatePropertyStatements(newPropertyStatement)
                temp_properties_statements.value.push(newPropertyStatement)
                properties_statements.value.push(newPropertyStatement)
                propertiesStore.fetchPropertiesStatements()
                alert('property statement updated succesfully')
            } else if (!existingStatement && temp_properties_statements.value.length > 0) {
                if (temp_properties_statements.value._id) {
                    propertiesStore.updatePartialStatements(newPropertyStatement)
                    temp_properties_statements.value.push(newPropertyStatement)
                    properties_statements.value.push(payload)
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
                properties_statements.value.push(payload)
                propertiesStore.fetchPropertiesStatements()
                alert('property statement patched succesfully yap')
            }
        }
    } else if (property_full_payment_form.value.payment_date !== current_payment_date.value) {
        alert('You are updating property statements for ' + current_payment_date.value + ' change current date to update rent for ' + property_full_payment_form.value.payment_date)
    } else {
        alert('Invalid input, check entries & try again')
    }


}


const submit_full_property_statement = (property) => {
    let newPropertyStatement = {
        "property_id": property._id,
        "property_name": property.property_name,
        "total_rent_collected": total_rent_collected.value,
        "commision": 6000,
        "payment_date": current_payment_date.value,
        "payment_mode": property.payment_mode,
        "bank_name": property.bank_name,
        "account_number": property.account_number,
        "kplc_meter": property.kplc_meter,
        "kplc_units": 0,
        "kplc_amount": 0,
        "water_amount": 0,
        "water_meter": property.water_meter,
        "water_units": 0,
        "mri_kra_pin": property.mri_kra_pin,
        "mri_itax_pass": property.mri_itax_pass,
        "mri_units": 0,
        "mri_amount": 0
    }

    const existingStatement = properties_statements.value.find(item => item.payment_date === newPropertyStatement.payment_date && item.property_id == newPropertyStatement.property_id)

    if (property_full_payment_form.value.payment_date === current_payment_date.value) {
        if (!existingStatement && temp_properties_statements.value.length === 0) {
            propertiesStore.updatePropertyStatements(newPropertyStatement)
            temp_properties_statements.value.push(newPropertyStatement)
            properties_statements.value.push(newPropertyStatement)
            propertiesStore.fetchPropertiesStatements()
            alert('property statement updated succesfully')
        } else if (!existingStatement && temp_properties_statements.value.length > 0) {
            if (temp_properties_statements.value._id) {
                propertiesStore.updatePartialStatements(newPropertyStatement)
                temp_properties_statements.value.push(newPropertyStatement)
                properties_statements.value.push(newPropertyStatement)
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
            properties_statements.value.push(payload)
            propertiesStore.fetchPropertiesStatements()
            alert('property statement patched succesfully yap')
        }
    } else if (property_full_payment_form.payment_date !== current_payment_date.value) {
        alert('You are updating property statements for ' + current_payment_date.value + ' change current date to update rent for ' + property_full_payment_form.value.payment_date)
    } else {
        alert('Invalid input, check entries & try again')
    }


}

const deduct_property_commision = (x, y) => {

    console.log(x)
    alert('deduct commision')
}

const tenant_deposit_refund = (x, y) => {

    const existingDeposit = tenants.value.find(item => item.property_id === y && item.hse_number === x.house_number)

    if (existingDeposit) {
        console.log(existingDeposit)
        console.log(x)
    } else {
        console.log('apa ni wapi?')
        //console.log(x)
    }
    /*
    if (!existingDeposit) {
        let x = tenants.value.filter((tenant) => tenant.property_id === payload._id && tenant.hse_number === payload.house_number);
        console.log(payload)
        x[0].deposit_held = payload.deposit
        let y = x[0].deposit_held
        console.log(x[0])
        other_income_list.value.push(x[0])
        tenantsStore.updateTenantDeposit(x[0])
    } else if (existingDeposit) {
        alert("Deposit Already Updated!")
    } else (
        alert("Refresh Page & Retry")
    )
    alert('Refund deposit')*/
}

const deduct_property_overpayment = (x, y) => {
    alert('deduct property overpayment')
}

const deduct_paid_to_landlord = (x, y) => {
    alert('deduct paid to landlord')
}

const add_new_other_statement_income = (x, y) => {
    let payload = {
        ...x,
        ...y
    }
    other_income_list.value.push(payload)
    console.log(payload)
}

const add_other_property_expenses = (i, j) => {
    console.log(i)
}

const add_new_other_statement_deposit = (income, expense) => {
    let payload = {
        ...income,
        ...expense
    }

    const existingDeposit = other_income_list.value.find(item => item.deposit_amount === payload.deposit_amount && item.hse_number === payload.hse_number)

    if (!existingDeposit) {
        let x = tenants.value.filter((tenant) => tenant.property_id === payload._id && tenant.hse_number === payload.house_number);
        console.log(payload)
        x[0].deposit_held = payload.deposit
        let y = x[0].deposit_held
        console.log(x[0])
        other_income_list.value.push(x[0])
        tenantsStore.updateTenantDeposit(x[0])
    } else if (existingDeposit) {
        alert("Deposit Already Updated!")
    } else (
        alert("Refresh Page & Retry")
    )


}


const submit_full_rent = (showUpdateTenant) => {
    if (tenants_full_rent_form.value.hse_number == '' && tenants_full_rent_form.value.payment_date == '') {
        alert('Select valid house number & the payment date')
    } else if (tenants_full_rent_form.hse_number !== '' && tenants_full_rent_form.value.payment_date == '') {
        alert('Select a valid payment date')
    } else if (tenants_full_rent_form.hse_number == '' && tenants_full_rent_form.value.payment_date !== '') {
        alert('Select a valid house number')
    } else if (tenants_full_rent_form.hse_number !== '' && tenants_full_rent_form.value.payment_date !== '' && tenants_full_rent_form.value.payment_date == current_payment_date.value) {

        const newStatementItem = {
            "property_name": showUpdateTenant.property_name,
            "property_id": showUpdateTenant._id,
            "hse_number": tenants_full_rent_form.value.hse_number,
            "tenant_name": showUpdateTenant.tenant_name,
            "payment_date": tenants_full_rent_form.value.payment_date,
            "house_rate": showUpdateTenant.house_rate,
            "rent_paid": showUpdateTenant.house_rate,
            "arrears": 0,
            "arrears_bf": 0,
            "arrears_cf": 0,
            "contact": "0729490094",
            "months_rent_status": true,
            "tenant_id": showUpdateTenant._id
        }

        const existingStatement = tenants_statements.value.find(item => item.payment_date === newStatementItem.payment_date && item.tenant_id == newStatementItem.tenant_id)

        if (!existingStatement && temp_tenants_statements.value.length === 0) {
            tenantsStore.updateTenantStatements(newStatementItem)
            temp_tenants_statements.value.push(newStatementItem)
            tenants_statements.value.push(newStatementItem)
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

    } else if (tenants_full_rent_form.value.hse_number !== '' && tenants_full_rent_form.value.payment_date !== '' && tenants_full_rent_form.value.payment_date !== current_payment_date.value) {
        alert('You are updating rent for ' + current_payment_date.value + ' change current date to update rent for ' + tenants_full_rent_form.value.payment_date)
    } else {
        alert('Invalid input, check entries & try again')
    }

}

const submit_partial_rent = (showUpdateTenant) => {
    if (tenants_partial_rent_form.value.hse_number !== '' && tenants_partial_rent_form.value.payment_date !== '' && tenants_partial_rent_form.value.payment_date == current_payment_date.value) {
        let newStatementItem = {
            "property_name": showUpdateTenant.property_name,
            "property_id": showUpdateTenant._id,
            "hse_number": tenants_partial_rent_form.value.hse_number,
            "tenant_name": showUpdateTenant.tenant_name,
            "payment_date": tenants_partial_rent_form.value.payment_date,
            "house_rate": showUpdateTenant.house_rate,
            "rent_paid": Number(tenants_partial_rent_form.value.rent_paid),
            "arrears": showUpdateTenant.house_rate - Number(tenants_partial_rent_form.value.rent_paid),
            "arrears_bf": 0,
            "arrears_cf": 0,
            "contact": showUpdateTenant.contact,
            "months_rent_status": false,
            "tenant_id": showUpdateTenant._id,
        }
        const existingStatement = tenants_statements.value.find(item => item.payment_date === newStatementItem.payment_date && item.property_name == newStatementItem.property_name && item.hse_number == newStatementItem.hse_number)

        if (!existingStatement && temp_tenants_statements.value.length === 0) {
            if (newStatementItem.rent_paid > newStatementItem.house_rate) {
                alert('Input an amount equal to or less than arrears for the month, arrears for the current month is KES: ' + showUpdateTenant.house_rate)
            } else if (newStatementItem.rent_paid === newStatementItem.house_rate) {
                tenantsStore.updateTenantStatements(newStatementItem)
                temp_tenants_statements.value.push(newStatementItem)
                tenants_statements.value.push(newStatementItem)
                alert('Rent for ' + current_payment_date.value + ' is fully paid')
            }
            else if (newStatementItem.rent_paid <= newStatementItem.house_rate && newStatementItem.rent_paid <= 0) {
                alert('Input an amount greater than 0')
            } else if (newStatementItem.rent_paid <= newStatementItem.house_rate && newStatementItem.rent_paid > 0) {
                tenantsStore.updateTenantStatements(newStatementItem)
                temp_tenants_statements.value.push(newStatementItem)
                tenants_statements.value.push(newStatementItem)
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
                        "hse_number": tenants_partial_rent_form.value.hse_number,
                        "tenant_name": existingStatement.tenant_name,
                        "payment_date": tenants_partial_rent_form.value.payment_date,
                        "house_rate": existingStatement.house_rate,
                        "rent_paid": Number(tenants_partial_rent_form.rent_paid),
                        "unpaid_rent": arrears,
                        "current_month_fully_paid": false,
                        "arrears": arrears,
                        "arrears_bf": 0,
                        "arrears_cf": 0,
                        "tenant_number": "0729490094",
                        "id": existingStatement._id
                    }
                    tenantsStore.updatePartialStatements(newStatementItem)
                    alert('update statement here 101010 PARTIAL UPDATE')

                    console.log(existingStatement)
                } else if (newStatementItem.rent_paid > existingStatement.arrears) {
                    alert('Input an amount equal to or less than arrears for the month, arrears for the currennt month is KES: ' + existingStatement.arrears)
                }

            }
        }

    } else if (tenants_partial_rent_form.value.hse_number !== '' && tenants_partial_rent_form.value.payment_date !== '' && tenants_partial_rent_form.value.payment_date !== current_payment_date.value) {
        alert('You are updating rent for ' + current_payment_date.value + ' change current date to update rent for ' + tenants_partial_rent_form.value.payment_date)
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
        <h4>We are getting the app ready for you</h4>
    </div>
    <div class="property_list" v-else>
        <template v-if="showPayments">
            <div class="properties" v-show="showingPropertiesList == true">
                <div class="prop_list_wrap">
                    <div v-show="!showingAddProperty">
                        <button @click="view_add_new_property()" class="view_tenants_button">
                            Add new Property</button>
                    </div>
                    <div v-show="showingAddProperty">
                        <button @click="back_to_properties_list_from_add_property()" class="view_tenants_button">
                            Back To Property List</button>
                    </div>

                </div>

                <div class="add_property_wrap" v-show="showingAddProperty">
                    <div class="paid_in_full_form_properties_partial">
                        <div class="paid_in_full_header">
                            <h3>Add Property</h3>
                        </div>
                        <div class="tenant_paid_in_full_form">
                            <form @submit.prevent="add_new_property()" class="modify_property_statements_form">
                                <div v-for="(field, key) in add_property_formFields" :key="key">
                                    <label :for="key">{{ field.label }}</label>
                                    <input :id="key" type="text" class="select" :placeholder="field.placeholder"
                                        required v-model="add_property_form_values[key]" />
                                    <span v-if="add_property_form_errors[key]">{{ add_property_form_errors[key]
                                        }}</span>
                                </div>
                                <div>
                                    <button type="submit" class="view_tenants_button submit_button">Submit</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="properties-list" v-show="!showingAddProperty">
                        <div class="properties-list-header">
                            <h2>Properties List</h2>
                        </div>
                        <div class="properties-list-content">
                            <div class="property-header">
                                <div class="landlord_name">Landlord Name</div>
                                <div class="property_name">Property Name</div>
                                <div class="property_location">Location</div>
                                <div class="landlord_contact">Contact</div>
                                <div class="commision">Payment Details</div>
                                <div class="view_tenats">Tenants List</div>
                            </div>
                            <div class="property-item" v-for="property in properties" :key="property.property_name">
                                <div class="landlord_name">{{ property.landlord_name }}</div>
                                <div class="property_name">{{ property.property_name }}</div>
                                <div class="property_location">{{ property.property_location }}</div>
                                <div class="landlord_contact">{{ property.contact }}</div>
                                <div class="commision">
                                    <button @click="view_property_statements(property)" class="view_tenants_button">
                                        Property Statements
                                    </button>
                                </div>
                                <div class="view_tenant_link">
                                    <button @click="view_tenant_list(property)" class="view_tenants_button">
                                        View Tenants List
                                    </button>
                                </div>
                            </div>
                            <div class="totals_row">
                                <div class="total-content"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="payment_details" v-show="showingPropertyStatements">
                <div class="payment_details_nav">
                    <div class="back_to_properties_list">
                        <button @click.prevent="from_property_statements" class="back_to_properties_button">Back to
                            Properties List</button>
                    </div>
                    <div class="back_to_properties_list">
                        <button @click="update_property_statements(showPayments)" class="view_tenants_button">Update
                            Property Statements</button>
                    </div>
                </div>
                <h2>Property Statements for {{ showPayments.property_name }}</h2>
                <div class="property_statement_months" v-show="showingPropertyPaymentMonths">
                    <div class="statement_month" v-for="(month, key) in payment_months_options" :key="key"
                        @click="property_per_month_statement(showPayments, month.month)">
                        <h4>{{ month.month }}</h4>
                    </div>

                </div>
                <div class="property_statement_months" v-show="!showingPropertyPaymentMonths">
                    <div>
                        <div class="property_statements">
                            <div class="property-header">
                                <div class="hse_number">House Number</div>
                                <div class="tenant_name">Tenant Name</div>
                                <div class="house_rate">House Rate</div>
                                <div class="rent">Rent Paid</div>
                                <div class="unpaid_rent">Unpaid Rent</div>
                                <div class="arrears_bf">Arrears BF</div>
                                <div class="arrears_paid">Arrears Paid</div>
                                <div class="arrears_cf">Arrears CF</div>
                            </div>
                            <div>
                                <div class="property-item" v-for="(tenant, index) in filteredTenantsList" :key="index">
                                    <div class="hse_number">{{ tenant.hse_number }}</div>
                                    <div class="tenant_name">{{ tenant.tenant_name }}</div>
                                    <div class="house_rate">{{ tenant.house_rate }}</div>
                                    <div class="rent_paid">
                                        <div class="rent_paid"
                                            v-for="(property_tenant_statement, index) in filteredPropertyStatementsPerMonth"
                                            :key="index">
                                            <div v-if="property_tenant_statement.hse_number === tenant.hse_number">
                                                {{ property_tenant_statement.rent_paid }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rent_paid">
                                        <template
                                            v-for="(property_tenant_statement, index) in filteredPropertyStatementsPerMonth"
                                            :key="index">
                                            <div v-if="property_tenant_statement.hse_number === tenant.hse_number">
                                                {{ property_tenant_statement.arrears }}
                                            </div>
                                        </template>
                                    </div>

                                    <div class="rent_paid">
                                        <template v-for="(statement, index) in filteredPropertyStatementsPerMonth"
                                            :key="index">
                                            <div v-if="statement.hse_number === tenant.hse_number">
                                                {{ statement.arrears_bf }}
                                            </div>
                                        </template>

                                    </div>


                                    <div class="rent_paid">
                                        <div class="rent_paid"
                                            v-for="(property_tenant_statement, index) in filteredPropertyStatementsPerMonth"
                                            :key="index">
                                            <div v-if="property_tenant_statement.hse_number === tenant.hse_number">
                                                {{ property_tenant_statement.arrears_paid }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rent_paid">
                                        <div class="rent_paid"
                                            v-for="(property_tenant_statement, index) in filteredPropertyStatementsPerMonth"
                                            :key="index">
                                            <div v-if="property_tenant_statement.hse_number === tenant.hse_number">
                                                {{ property_tenant_statement.arrears_cf }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="property-statement_footer property-header">
                                <div class="hse_number">Totals</div>
                                <div class="tenant_name"> </div>
                                <div class="house_rate"> </div>
                                <div class="rent">{{ total_rent_collected_per_property }}</div>
                                <div class="unpaid_rent">{{ total_arrears_per_property }}</div>
                                <div class="arrears_bf">{{ total_arrears_bf_per_property }}</div>
                                <div class="arrears_paid">{{ total_arrears_paid_per_property }}</div>
                                <div class="arrears_cf">{{ total_arrears_cf_per_property }}</div>
                            </div>

                            <div class="property_statement_summary">
                                <h4 class="property_statememt_date"> {{ current_payment_date }} Statement Summary</h4>
                                <div class="">
                                    <div class="property_statement_summary_header">
                                        <div class="statement_header_item">
                                            <h4>Summary</h4>
                                        </div>
                                        <div class="statement_header_item statement_header_amount">
                                            <h4>Amount</h4>
                                        </div>
                                    </div>
                                    <div class="property_statement_gross_wrap">
                                        <div class="property_statement_summary_item">
                                            <div>
                                                <p>Total Rent Paid:</p>
                                            </div>
                                            <div class="statement_header_amount">
                                                <p>{{ total_rent_collected_per_property }}</p>
                                            </div>

                                        </div>
                                        <div class="property_statement_summary_item">
                                            <div>
                                                <p>Total Unpaid Paid:</p>
                                            </div>
                                            <div class="statement_header_amount">
                                                <p>{{ total_arrears_per_property }}</p>
                                            </div>
                                        </div>
                                        <div class="property_statement_summary_item">
                                            <div>
                                                <p>Total Collections:</p>
                                            </div>
                                            <div class="statement_header_amount">
                                                <p>{{ total_rent_collected_per_property }}</p>
                                            </div>
                                        </div>
                                        <div
                                            class="property_other_statement_form_wrap property_other_statement_form_wrap_deposit">
                                            <form
                                                @submit.prevent="add_new_other_statement_deposit(property_other_statement_form_values, showPayments)"
                                                class="property_other_statement_form">
                                                <div class="other_statement_form_input_deposit">
                                                    <div class="deposit_input_wrap">
                                                        <div class="deposit_input_wrap_label">
                                                            <label class="other_statement_label"> Deposit:</label>
                                                        </div>
                                                        <div class="deposit_input_wrap_value">
                                                            <input type="text" class="other_statement_select"
                                                                placeholder="Please input deposit amount" required
                                                                v-model="property_other_statement_form_values.deposit" />
                                                            <span v-if="property_other_statement_form_errors.deposit">{{
                                                                property_other_statement_form_errors.deposit
                                                            }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="deposit_select_hse">
                                                        <select
                                                            v-model="property_other_statement_form_values.house_number"
                                                            required class="select other_statement_select">
                                                            <option disabled value="">Please select House Number
                                                            </option>
                                                            <option v-for="(tenant, index) in filteredTenantsList"
                                                                :key="index">{{
                                                                    tenant.hse_number }}
                                                            </option>
                                                        </select>
                                                        <span v-if="property_other_statement_form_errors.deposit">{{
                                                            property_other_statement_form_errors.deposit
                                                        }}</span>
                                                    </div>
                                                    <div class="deposit_select_hse_btn">
                                                        <button type="submit" class="deposit_input_btn">Ok</button>
                                                    </div>
                                                </div>

                                            </form>
                                        </div>

                                        <div class=" property_statement_summary_item_form">
                                            <div class="other_income_list">
                                                <div class=" other_incomes_list">
                                                    <h5 class="header_underline">Other Incomes List:</h5>
                                                    <div v-for="(income, index) in other_income_list" :key="index"
                                                        class="property_statement_summary_item property_statement_summary_item_income">
                                                        <template v-if="income.deposit_held">
                                                            <div>
                                                                <p>Deposit for Hse Number: {{ income.hse_number }}</p>
                                                            </div>
                                                            <div class="statement_header_amount">
                                                                <p>{{ income.deposit_held }}</p>
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            <div>
                                                                <p>{{ income.income_name }} </p>
                                                            </div>
                                                            <div class="statement_header_amount">
                                                                <p>{{ income.income_amount }}</p>
                                                            </div>
                                                        </template>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="property_other_statement_form_wrap">
                                                <div class="other_income_form_header">
                                                    <h5 class="header_underline">Input other Income items here: </h5>
                                                </div>
                                                <form
                                                    @submit.prevent="add_new_other_statement_income(property_other_statement_form_values, showPayments)"
                                                    class="property_other_statement_form">
                                                    <div class="other_statement_form_input other_expense_name">
                                                        <div>
                                                            <label for="key" class="other_statement_label"> Income Name
                                                                : </label>
                                                        </div>
                                                        <div class="">
                                                            <input type="text" class="other_statement_select"
                                                                placeholder="Please Input Income Name" required
                                                                v-model="property_other_statement_form_values.income_name" />
                                                        </div>

                                                    </div>
                                                    <div class="other_statement_form_input other_expense_name">
                                                        <div>
                                                            <label for="key" class="other_statement_label"> Income
                                                                Amount : </label>
                                                        </div>
                                                        <div class="">
                                                            <input type="text" class="other_statement_select"
                                                                placeholder="Please Input Income Amount" required
                                                                v-model="property_other_statement_form_values.income_amount" />
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <button type="submit" class="submit_button"
                                                            style="color:rgb(243, 228, 26); margin-left: 33%;">Submit</button>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>
                                        <div class="property_statement_summary_header gross_pay">
                                            <div class="gross_wrap">
                                                <h3>Gross Pay:</h3>
                                            </div>
                                            <div class="statement_header_amount gross_value">
                                                <p>{{ property_gross_pay }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="deductions_wrap">
                                        <div class="property_statement_summary_header deductions_header_wrap">
                                            <div class="deductions_header">
                                                <h3 style="text-align: center;">Deductions</h3>
                                            </div>
                                        </div>
                                        <div class="property_other_statement_form_wrap_deposit">
                                            <form
                                                @submit.prevent="deduct_property_commision(property_monthly_deductions, showPayments._id)"
                                                class="property_other_statement_form">
                                                <div class="other_statement_form_input_deductions">
                                                    <div class="deposit_input_wrap">
                                                        <div class="deposit_input_wrap_label">
                                                            <label class="other_statement_label"> Commision
                                                                Payable:</label>
                                                        </div>
                                                        <div class="deposit_input_wrap_value">
                                                            <input type="text" class="other_statement_select"
                                                                placeholder="Please input commision payable amount"
                                                                required
                                                                v-model="property_monthly_deductions.commision" />
                                                            <span
                                                                v-if="property_monthly_deductions_form_errors.commision">{{
                                                                    property_monthly_deductions_form_errors.commision
                                                                }}</span>
                                                        </div>
                                                    </div>

                                                    <div class="deposit_input_wrap">
                                                        <div class="deposit_input_wrap_label">
                                                            <label class="other_statement_label"> Over Payment:</label>
                                                        </div>
                                                        <div class="deposit_input_wrap_value">
                                                            <input type="text" class="other_statement_select"
                                                                placeholder="Please input over payment amount" required
                                                                v-model="property_monthly_deductions.overpayment" />
                                                            <span
                                                                v-if="property_monthly_deductions_form_errors.overpayment">{{
                                                                    property_monthly_deductions_form_errors.overpayment
                                                                }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="deposit_input_wrap">
                                                        <div class="deposit_input_wrap_label">
                                                            <label class="other_statement_label"> Paid To
                                                                Landlord:</label>
                                                        </div>
                                                        <div class="deposit_input_wrap_value">
                                                            <input type="text" class="other_statement_select"
                                                                placeholder="Please input paid to landlord amount"
                                                                required
                                                                v-model="property_monthly_deductions.paid_to_landlord" />
                                                            <span
                                                                v-if="property_monthly_deductions_form_errors.paid_to_landlord">{{
                                                                    property_monthly_deductions_form_errors.paid_to_landlord
                                                                }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="deposit_select_hse_btn">
                                                        <button type="submit" class="deposit_input_btn ">Submit</button>
                                                    </div>
                                                </div>

                                            </form>
                                        </div>
                                        <div
                                            class="property_other_statement_form_wrap property_other_statement_form_wrap_deposit">
                                            <form
                                                @submit.prevent="tenant_deposit_refund(property_monthly_deductions, showPayments._id)"
                                                class="property_other_statement_form">
                                                <div class="other_statement_form_input_deposit">
                                                    <div class="deposit_input_wrap">
                                                        <div class="deposit_input_wrap_label">
                                                            <label class="other_statement_label"> Deposit
                                                                Refund:</label>
                                                        </div>
                                                        <div class="deposit_input_wrap_value">
                                                            <input type="text" class="other_statement_select"
                                                                placeholder="Please input deposit refund amount"
                                                                required
                                                                v-model="property_monthly_deductions.deposit_refund" />
                                                            <span
                                                                v-if="property_monthly_deductions_form_errors.deposit_refund">{{
                                                                    property_monthly_deductions_form_errors.deposit_refund
                                                                }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="deposit_select_hse">
                                                        <select v-model="property_monthly_deductions.house_number"
                                                            required class="select other_statement_select">
                                                            <option disabled value="">Please select House Number
                                                            </option>
                                                            <option v-for="(tenant, index) in filteredTenantsList"
                                                                :key="index">{{
                                                                    tenant.hse_number }}
                                                            </option>
                                                        </select>
                                                        <span
                                                            v-if="property_monthly_deductions_form_errors.house_number">{{
                                                                property_monthly_deductions.house_number
                                                            }}</span>
                                                    </div>
                                                    <div class="deposit_select_hse_btn">
                                                        <button type="submit" class="deposit_input_btn">Ok</button>
                                                    </div>
                                                </div>

                                            </form>
                                        </div>
                                        <div class=" property_statement_summary_item_form">
                                            <div class="other_income_list">
                                                <div class=" other_incomes_list">
                                                    <h5 class="header_underline">Other Deductions List:</h5>
                                                    <div v-for="([key, value]) in populatedFields" :key="key"
                                                        class="property_statement_summary_item property_statement_summary_item_income">
                                                        <div v-if="key === 'commision'">
                                                            <p>Commision : {{ value }}</p>
                                                        </div>
                                                        <div v-if="key === 'overpayment'">
                                                            <p>OverPayment : {{ value }}</p>
                                                        </div>
                                                        <div v-if="key === 'paid_to_landlord'">
                                                            <p>Paid To Landlord : {{ value }}</p>
                                                        </div>
                                                        <div v-if="key === 'deposit_refund'">
                                                            <p>Deposit refund : {{ value }}</p>
                                                        </div>
                                                        <div v-if="key === 'expense_name'">
                                                            <p> {{key}} : {{ value }}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="property_other_statement_form_wrap">
                                                <div class="other_income_form_header">
                                                    <h5 class="header_underline">Input other Expenses here: </h5>
                                                </div>
                                                <form
                                                    @submit.prevent="add_other_property_expenses(property_monthly_deductions, showPayments._id)"
                                                    class="property_other_statement_form">
                                                    <div class="other_statement_form_input other_expense_name">
                                                        <div class="deposit_input_wrap_label">
                                                            <label for="key" class="other_statement_label"> Expense Name
                                                                : </label>
                                                        </div>
                                                        <div class="deposit_input_wrap_value">
                                                            <input type="text" class="other_statement_select"
                                                                placeholder="Please Input Expense Name" required
                                                                v-model="property_monthly_deductions.expense_name" />
                                                        </div>

                                                    </div>
                                                    <div class="other_statement_form_input other_expense_name">
                                                        <div class="deposit_input_wrap_label">
                                                            <label for="key" class="other_statement_label"> Expense
                                                                Amount : </label>
                                                        </div>
                                                        <div class="deposit_input_wrap_value">
                                                            <input type="text" class="other_statement_select"
                                                                placeholder="Please Input Expense Amount" required
                                                                v-model="property_monthly_deductions.expense_amount" />
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <button type="submit" class="submit_button"
                                                            style="color:rgb(243, 228, 26); margin-left: 33%;">Submit</button>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>
                                        <div class="property_statement_summary_header gross_pay">
                                            <div class="gross_wrap">
                                                <p>Total Deductions:</p>
                                            </div>
                                            <div class="statement_header_amount gross_value">
                                                <p>{{ property_total_deductions }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="property_statement_summary_header gross_pay">
                                        <div class="gross_wrap">
                                            <h3>Net Pay:</h3>
                                        </div>
                                        <div class="statement_header_amount gross_value">
                                            <p>{{ property_gross_pay - property_total_deductions }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <!--div class="payment_details" v-show="showingPropertyStatements">
                    <div>
                        <div class="property_statements">
                            <h2>Property Statements for {{ showPayments.property_name }}</h2>
                            <div class="property-header">
                                <div class="property_name">Property Name</div>
                                <div class="total_rent_paid">Total Rent Paid</div>
                                <div class="commision">Commission</div>
                                <div class="payment_date">Payment Date</div>
                                <div class="payment_mode">Mode</div>
                                <div class="bank_name">Bank Name</div>
                                <div class="account_number">Account Number</div>
                            </div>
                            <div class="property-item" v-for="(property, index) in filteredPropertyStatements"
                                :key="index">
                                <div class="property_name">{{ property.property_name }}</div>
                                <div class="total_rent_paid">{{ total_rent_collected_per_property_per_month }}</div>
                                <div class="commision-due">{{ property.commision }}</div>
                                <div class="payment">{{ property.payment_date }}</div>
                                <div class="payment_mode">{{ property.payment_mode }}</div>
                                <div class="bank_name">{{ property.bank_name }}</div>
                                <div class="owner_account_number">{{ property.account_number }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="property_utility">
                        <div class="water_electricity">
                            <h2>Water & Electricity Bills for {{ showPayments.property_name }}</h2>
                            <div class="property-header">
                                <div class="utility_name">Utility Name</div>
                                <div class="meter_number">Meter Number</div>
                                <div class="landlord_contact">Units</div>
                                <div class="commision">Amount</div>
                                <div class="payment_date">Date</div>
                            </div>
                            <div class="property-item" v-for="(property, index) in filteredPropertyStatements"
                                :key="index">
                                <div class="payment_mode">KPLC</div>
                                <div class="property_name">{{ property.kplc_meter }}</div>
                                <div class="owner_contact">{{ property.kplc_units }}</div>
                                <div class="commision-due">{{ property.kplc_amount }}</div>
                                <div class="payment">{{ property.payment_date }}</div>
                            </div>
                            <div class="property-item" v-for="(property, index) in filteredPropertyStatements"
                                :key="index">
                                <div class="payment_mode">Water</div>
                                <div class="property_name">{{ property.water_meter }}</div>
                                <div class="owner_contact">{{ property.water_units }}</div>
                                <div class="commision-due">{{ property.water_amount }}</div>
                                <div class="payment">{{ property.payment_date }}</div>
                            </div>
                        </div>

                        <div class="mri_bill">
                            <h2>MRI Bills for {{ showPayments.property_name }}</h2>
                            <div class="property-header">
                                <div class="utility_name">Utility Name</div>
                                <div class="meter_number">KRA PIN</div>
                                <div class="landlord_contact">I-TAX Password</div>
                                <div class="commision">Units</div>
                                <div class="commision">Amount</div>
                                <div class="payment_date">Date</div>
                            </div>
                            <div class="property-item" v-for="(property, index) in filteredPropertyStatements"
                                :key="index">
                                <div class="payment_mode">MRI</div>
                                <div class="property_name">{{ property.mri_kra_pin }}</div>
                                <div class="owner_contact">{{ property.mri_itax_pass }}</div>
                                <div class="owner_contact">{{ property.mri_units }}</div>
                                <div class="commision-due">{{ property.mri_amount }}</div>
                                <div class="payment">{{ property.payment_date }}</div>
                            </div>
                        </div>

                        <div class="other_property_expenses">
                            <h2>Expenses for {{ showPayments.property_name }}</h2>
                            <div class="property-header">
                                <div class="utility_name">Date</div>
                                <div class="meter_number">Type</div>
                                <div class="landlord_contact">Particulars</div>
                                <div class="commision">Amount</div>
                            </div>
                            <div class="property-item" v-for="(property, index) in filteredPropertyStatements"
                                :key="index">
                                <div class="owner_contact">{{ property.mri_itax_pass }}</div>
                                <div class="owner_contact">{{ property.mri_units }}</div>
                                <div class="commision-due">{{ property.mri_amount }}</div>
                                <div class="payment">{{ property.payment_date }}</div>
                            </div>
                        </div>
                    </div>
                </div-->
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
                            <div class="property_statement_details">
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
                        <div class="paid_in_full_form_properties">
                            <div class="paid_in_full_header total_rent_per_property_h2">
                                <h3>Update Total Rent Collected per Property</h3>
                            </div>
                            <div class="">
                                <form @submit.prevent="submit_full_property_statement(showPayments)"
                                    class="modify_property_statements">
                                    <div>
                                        <span class="input_text">Select Month: </span><select
                                            v-model="property_full_payment_form.payment_date" required class="select">
                                            <option disabled value="">Please select month</option>
                                            <option v-for="month in payment_months_options" :key="month">{{ month.month
                                                }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <button class="view_tenants_button submit_button">submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>

                        <div class="paid_in_full_form_properties_partial">
                            <div class="paid_in_full_header">
                                <h3>Partial Payment</h3>
                            </div>
                            <div class="tenant_paid_in_full_form">
                                <!--form @submit.prevent="submit_modified_property_statement(showPayments)" class="modify_property_statements_form">
                                    <div>
                                        <span class="input_text">Select Month: </span><select
                                            v-model="property_partial_payment_form.payment_date" required class="select">
                                            <option disabled value="">Please select month</option>
                                            <option v-for="month in payment_months_options" :key="month">{{ month.month
                                                }}
                                            </option>
                                        </select>
                                    </div>
                                    <div v-for="(field, key) in formFields" :key="key">
                                        <label :for="key">{{ field.label }}</label>
                                        <input :id="key" type="text" class="select" :placeholder="field.placeholder"
                                            required v-model="formValues[key]" @input="() => validateInput(key)" />
                                        <span v-if="formErrors[key]">{{ formErrors[key] }}</span>
                                    </div>
                                    <div>
                                        <button type="submit" class="view_tenants_button submit_button">Submit</button>
                                    </div>

                                </form-->
                                <form @submit.prevent="submit_modified_property_statement(showPayments)"
                                    class="modify_property_statements_form">
                                    <div>
                                        Property Name:<select v-model="property_partial_payment_form.property_name"
                                            required class="select">
                                            <option disabled value="">Please select property name</option>
                                            <option>{{ showPayments.property_name }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        Select Month: <select v-model="property_partial_payment_form.payment_date"
                                            required class="select">
                                            <option disabled value="">Please select month</option>
                                            <option v-for="month in payment_months_options" :key="month">{{ month.month
                                                }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        KPLC Amount : <input v-model="property_partial_payment_form.kplc_amount"
                                            class="select" required placeholder="Input KPLC Amount"
                                            @input="validateInput">
                                    </div>
                                    <div>
                                        KPLC Units <input v-model="property_partial_payment_form.kplc_units"
                                            class="select" required placeholder="Input KPLC Units">
                                    </div>
                                    <div>
                                        Water Amount <input v-model="property_partial_payment_form.water_amount"
                                            class="select" required placeholder="Input Water Amount">
                                    </div>
                                    <div>
                                        Water Units <input v-model="property_partial_payment_form.water_units"
                                            class="select" required placeholder="Input Water Units">
                                    </div>
                                    <div>
                                        MRI Amount <input v-model="property_partial_payment_form.mri_amount"
                                            class="select" required placeholder="Input  MRI Amount">
                                    </div>
                                    <div>
                                        MRI Units <input v-model="property_partial_payment_form.mri_units"
                                            class="select" required placeholder="Input MRI Units">
                                    </div>

                                    <div>
                                        <button class="view_tenants_button submit_button">submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </template>

        <template v-if="showTenants">
            <div class="tenant_per_property">
                <div v-show="showingTenantsList == true">
                    <div class="back_to_properties_list three_nav">
                        <div v-show="!showingAddHouse">
                            <button @click.prevent="back_to_properties_list" class="back_to_propeties_button">Back to
                                Properties
                                List</button>
                        </div>
                        <div v-show="!showingAddHouse">
                            <button @click="view_add_new_house()" class="view_tenants_button">
                                Add new House</button>
                        </div>
                        <div v-show="showingAddHouse">
                            <button @click.prevent="back_to_tenants_list_from_add_house"
                                class="back_to_propeties_button">Back to Tenants
                                List
                            </button>
                        </div>
                    </div>
                    <div class="add_property_wrap" v-show="showingAddHouse">

                        <div class="paid_in_full_form_properties_partial">
                            <div class="paid_in_full_header">
                                <h3>Add New House Number</h3>
                            </div>
                            <div class="tenant_paid_in_full_form">
                                <form @submit.prevent="add_new_house(add_house_form_values)"
                                    class="modify_property_statements_form">
                                    <div>
                                        Property Name:<select v-model="add_house_form_values.property_name" required
                                            class="select">
                                            <option disabled value="">Please select property name</option>
                                            <option>{{ showTenants.property_name }}</option>
                                        </select>
                                    </div>
                                    <div v-for="(field, key) in add_house_formFields" :key="key">
                                        <label :for="key">{{ field.label }}</label>
                                        <input :id="key" type="text" class="select" :placeholder="field.placeholder"
                                            required v-model="add_house_form_values[key]" />
                                        <span v-if="add_house_form_errors[key]">{{ add_house_form_errors[key] }}</span>
                                    </div>
                                    <div>
                                        House Status:<select v-model="add_house_form_values.status" required
                                            class="select">
                                            <option disabled value="">Please select house status</option>
                                            <option v-for="(status, index) in house_status" :key="index">{{
                                                status.status }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <button type="submit" class="view_tenants_button submit_button">Submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>

                        <div class="paid_in_full_form_properties_partial">
                            <div class="paid_in_full_header">
                                <h3>Add Tenant to existing house number</h3>
                            </div>
                            <div class="tenant_paid_in_full_form">
                                <form @submit.prevent="add_new_tenant(add_tenant_form_values)"
                                    class="modify_property_statements_form">
                                    <div>
                                        Property Name:<select v-model="add_tenant_form_values.property_name" required
                                            class="select">
                                            <option disabled value="">Please select property name</option>
                                            <option>{{ showTenants.property_name }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        House Number:<select v-model="add_tenant_form_values.hse_number" required
                                            class="select">
                                            <option disabled value="">Please select house number</option>
                                            <option v-for="(hse, key, index) in filteredTenantsList" :key="index">{{
                                                hse.hse_number }}</option>
                                        </select>
                                    </div>
                                    <div v-for="(field, key) in add_tenant_formFields" :key="key">
                                        <label :for="key">{{ field.label }}</label>
                                        <input :id="key" type="text" class="select" :placeholder="field.placeholder"
                                            required v-model="add_tenant_form_values[key]" />
                                        <span v-if="add_tenant_form_errors[key]">{{ add_tenant_form_errors[key]
                                            }}</span>
                                    </div>
                                    <div>
                                        House Status:<select v-model="add_tenant_form_values.status" required
                                            class="select">
                                            <option disabled value="">Please select house status</option>
                                            <option v-for="(status, index) in house_status" :key="index">{{
                                                status.status }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <button type="submit" class="view_tenants_button submit_button">Submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>

                        <div class="paid_in_full_form_properties_partial">
                            <div class="paid_in_full_header">
                                <h3>Terminate Tenant</h3>
                            </div>
                            <div class="tenant_paid_in_full_form">
                                <form @submit.prevent="add_new_house(add_tenant_form_values)"
                                    class="modify_property_statements_form">
                                    <div>
                                        Property Name:<select v-model="add_tenant_form_values.property_name" required
                                            class="select">
                                            <option disabled value="">Please select property name</option>
                                            <option>{{ showTenants.property_name }}</option>
                                        </select>
                                    </div>
                                    <div v-for="(field, key) in add_tenant_formFields" :key="key">
                                        <label :for="key">{{ field.label }}</label>
                                        <input :id="key" type="text" class="select" :placeholder="field.placeholder"
                                            required v-model="add_tenant_form_values[key]" />
                                        <span v-if="add_tenant_form_errors[key]">{{ add_tenant_form_errors[key]
                                            }}</span>
                                    </div>
                                    <div>
                                        House Status:<select v-model="add_tenant_form_values.status" required
                                            class="select">
                                            <option disabled value="">Please select house status</option>
                                            <option v-for="(status, index) in house_status" :key="index">{{
                                                status.status }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <button type="submit" class="view_tenants_button submit_button">Submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </div>


                    <div class="tenant" v-show="!showingAddHouse">
                        <div class="tenant-header">
                            <h2>Tenants List for {{ showTenants.property_name }}</h2>
                        </div>
                        <div class="property-header">
                            <div class="hse_number">Hse Number</div>
                            <div class="tenant_name">Tenant's Name</div>
                            <div class="house_rate">Rate</div>
                            <div class="rent_paid">Rent Paid for Current Month</div>
                            <div class="tenant_number">Contact</div>
                            <div class="alternative_number">Alternative Number</div>
                            <div class="id_number">Id Number</div>
                            <div class="status">Status</div>
                            <div class="property_name">Tenant Statements</div>
                            <div class="property_name">Update Tenant Details</div>
                        </div>
                        <div class="property-item" v-for="hse in filteredTenantsList" :key="hse.hse_number">
                            <div class="hse_number">{{ hse.hse_number }}</div>
                            <div class="tenant_name">{{ hse.tenant_name }}</div>
                            <div class="house_rate">{{ hse.house_rate }}</div>
                            <div class="rent_paid">{{ hse.rent_paid_for_current_month }}</div>
                            <div class="tenant_number">{{ hse.contact }}</div>
                            <div class="alternative_number">{{ hse.alternative_contact }}</div>
                            <div class="id_number">{{ hse.id_number }}</div>
                            <div class="status">{{ hse.status }}</div>
                            <div class="view_tenant_statements">
                                <button @click="view_tenant_statements(hse)" class="view_tenants_button">Tenant
                                    Statements</button>
                            </div>
                            <div class="view_tenant__link">
                                <button @click="update_tenant(hse)" class="view_tenants_button">Update Tenant</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="tenant_per_property" v-show="showingTenantStatements == true">

                    <div class="payment_datils_nav">
                        <div class="back_to_properties_list">
                            <button @click.prevent="back_to_tenants_list" class="back_to_propeties_button">Back to
                                Tenants
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
                        <table style="width:100%; display: none;" ref="pdfContent">
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
                            <tr class="house" v-for="(hse, key, index) in filteredTenantStatements" :key="index">
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
                                <td>{{ total_rent_collected }} </td>
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
                            </tr>
                            <tr class="house" v-for="(hse, key, index) in filteredTenantStatements" :key="index">
                                <td class="hse_number">{{ hse.hse_number }} </td>
                                <td class="tenant_name">{{ hse.tenant_name }} </td>
                                <td class="payment_date">{{ hse.payment_date }} </td>
                                <td class="house_rate">{{ hse.house_rate }} </td>
                                <td class="rent_paid">{{ hse.rent_paid }}</td>
                                <td class="arrears"> {{ hse.arrears }}</td>
                                <td class="unpaid_rent">{{ hse.arrears_bf }}</td>
                                <td class="arrears_cf"> {{ hse.arrears_cf }}</td>
                            </tr>

                            <tr class="totals_row">
                                <td colspan="4">
                                    <div class="totals"> Totals</div>
                                </td>
                                <td>{{ total_rent_collected_per_hse }}</td>
                                <td>{{ total_unpaid_rent }}</td>
                                <td>{{ total_arrears_bf }}</td>
                                <td>{{ total_arrears_cf }}</td>
                            </tr>

                        </table>

                    </div>

                    <div class="download_button_wrap">
                        <button @click='download_tenant_statement(tempShowTenant)'
                            class="back_to_propeties_button">Download
                            Tenant Statements
                        </button>
                    </div>

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
                                    <div>
                                        House No: <select v-model="tenants_full_rent_form.hse_number" required
                                            class="select">
                                            <option disabled value="">Please select house number</option>
                                            <option>{{ showUpdateTenant.hse_number }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        Month: <select v-model="tenants_full_rent_form.payment_date" required
                                            class="select">
                                            <option disabled value="">Please select month</option>
                                            <option v-for="month in payment_months_options" :key="month">{{ month.month
                                                }}
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <button class="view_tenants_button submit_button">submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>

                        <div class="paid_in_full">
                            <div class="paid_in_full_header">
                                <h3>Partial Payment</h3>
                            </div>
                            <div class="paid_in_full_form">
                                <form @submit.prevent="submit_partial_rent(showUpdateTenant)">
                                    <div>
                                        House No:<select v-model="tenants_partial_rent_form.hse_number" required
                                            class="select">
                                            <option disabled value="">Please select house number</option>
                                            <option>{{ showUpdateTenant.hse_number }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        Month: <select v-model="tenants_partial_rent_form.payment_date" required
                                            class="select">
                                            <option disabled value="">Please select month</option>
                                            <option v-for="month in payment_months_options" :key="month">{{ month.month
                                                }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        Ammount Paid <input v-model="tenants_partial_rent_form.rent_paid" required
                                            placeholder="Input Amount">
                                    </div>
                                    <div>
                                        <button class="view_tenants_button submit_button">submit</button>
                                    </div>



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
.properties-list {
    width: 100%;
}

.properties-list-header {
    text-align: center;
    margin-bottom: 20px;
}

.property-header,
.property-item {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}

.property-header {
    font-weight: bold;
    background-color: #f4f4f4;
}

.property-item {
    background-color: #ffffff;
}

.property-header>div,
.property-item>div {
    flex: 1;
    padding: 10px;
}

.view_tenants_button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
}

.view_tenants_button:hover {
    background-color: #0056b3;
}

.totals_row {
    text-align: center;
    padding: 20px 0;
}

@media (max-width: 768px) {

    .property-header>div,
    .property-item>div {
        flex: 100%;
        text-align: center;
    }

    .properties-list-content {
        padding: 0 10px;
    }

    .view_tenants_button {
        width: 100%;
        margin-top: 10px;
    }
}

.payment_details {
    width: 100%;
}

.payment_details_nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.back_to_properties_list {
    flex: 1;
    text-align: center;
}

.back_to_properties_button,
.view_tenants_button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
}

.back_to_properties_button:hover,
.view_tenants_button:hover {
    background-color: #0056b3;
}

.property_statements,
.property_utility {
    margin-bottom: 20px;
}

.property-header,
.property-item {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}

.property-header {
    font-weight: bold;
    background-color: #f4f4f4;
}

.property-header>div,
.property-item>div {
    flex: 1;
    padding: 10px;
}

.totals_row {
    text-align: center;
    padding: 20px 0;
}

@media (max-width: 768px) {

    .property-header>div,
    .property-item>div {
        flex: 100%;
        text-align: center;
    }

    .payment_details_nav {
        flex-direction: column;
        align-items: center;
    }

    .back_to_properties_button,
    .view_tenants_button {
        width: 100%;
        margin-top: 10px;
    }
}

.tenant-header {
    text-align: center;
    margin-bottom: 20px;
}

.property-header,
.property-item {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}

.property-header {
    font-weight: bold;
    background-color: #f4f4f4;
}

.property-header>div,
.property-item>div {
    flex: 1;
    padding: 10px;
}

.payment_details_nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.back_to_properties_list {
    flex: 1;
    text-align: center;
}

.back_to_properties_button,
.view_tenants_button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
}

.back_to_properties_button:hover,
.view_tenants_button:hover {
    background-color: #0056b3;
}

.tenant_statement_download_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.logo_wrap_statement_download {
    flex: 1;
    text-align: left;
}

.tenant_statement_header_items {
    flex: 3;
    text-align: right;
}

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