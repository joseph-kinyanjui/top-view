import { defineStore } from 'pinia'
import axios from 'axios'

const PROPERTIES_URL = "http://127.0.0.1:3000/api/properties"
const PROPERTY_STATEMENT_URL = "http://127.0.0.1:3000/api/properties/statements"

export const usePropertiesList = defineStore('propertiesList', {
  state: () => ({
    properties: [],
    loading: false,

  }),
  actions: {
    async fetchProperties() {
      try{
        this.loading = true;
        const response = await axios.get(PROPERTIES_URL)
        this.properties = response.data
        this.loading = false
      } catch(error){
        console.error('error fetchig properties list', error)
      }
    },
    async fetchPropertiesStatements() {
      try {
        const response = await axios.get(PROPERTY_STATEMENT_URL);
        this.tenants_statements = response.data;
      } catch (error) {
        console.error("error fetching data", error);
      }
    },
    async updateData(newProperty) {
      await fetch('/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty),
      });
      this.properties = newProperty; // Update local state
    }
  }
})
  
