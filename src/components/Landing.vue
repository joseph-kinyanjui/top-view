<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import { usePropertiesList } from '../stores/properties.js'
import { useTenantsList } from '../stores/tenants.js'

const tenantsStore = useTenantsList()
const propertiesStore = usePropertiesList()
const isLoading = ref(true);

const tenants = ref(tenantsStore.tenants)
const tenants_statements = ref(tenantsStore.tenants_statements)
const properties = ref(propertiesStore.properties)
const properties_statements = ref(propertiesStore.properties_statements)
const temp_tenants_statements = ref([])
const temp_properties_statements = ref([])

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

</script>

/*HTML*/
<template>
    <div class="loading_page" v-if="isLoading">
        <h1>Welcome To Top View Property Management dashboard</h1>
        <h4>We are getting the app ready for you</h4>
    </div>
    <div class="landing" v-else>
        <div class="background">
            <div class="glassy-overlay">
                <div class="content">
                    <h2>Welcome to Top View Limited</h2>
                    <p>Experience greatness with your number one property Management company in kenya</p>
                    <p>For a hassle free management of your properties</p>
                    <button>
                        <RouterLink class="RouterLink" to="/properties">Properties</RouterLink>
                    </button>
                    <button>
                        <RouterLink class="RouterLink" to="/tenants">Tenants</RouterLink>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>