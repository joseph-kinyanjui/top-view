import { defineStore } from 'pinia'
import axios from 'axios'

const PROPERTIES_URL = "https://top-view-server-pacpqd0zx-joseph-kinyanjuis-projects.vercel.app/properties"

export const usePropertiesList = defineStore('propertiesList', {
  state: () => ({
    properties: [
      {
        "landlord_name": "Stephen Miiri- SM",
        "contact": "0711222333",
        "property_name": "Stephen Miiri- SM",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Co-operative Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Movens Apartment",
        "contact": "0711222334",
        "property_name": "Movens Apartment",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Equity Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Stephen Murathi",
        "contact": "0711222335",
        "property_name": "Stephen Murathi",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Family Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Elizabeth",
        "contact": "0711222336",
        "property_name": "Elizabeth",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Absa Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Pithoni Irungu",
        "contact": "0711222337",
        "property_name": "Pithoni Irungu",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "KCB",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Kanyumbani",
        "contact": "0711222338",
        "property_name": "Kanyumbani",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "NCBA",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Agnes Kamau",
        "contact": "0711222339",
        "property_name": "Agnes Kamau",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "PRIME BANK",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Samuel Mwangi",
        "contact": "0711222340",
        "property_name": "Samuel Mwangi",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Co-operative Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Tabitha Njambi",
        "contact": "0711222341",
        "property_name": "Tabitha Njambi",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Equity Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Henry",
        "contact": "0711222342",
        "property_name": "Henry",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Family Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "ZabLon mwangi",
        "contact": "0711222343",
        "property_name": "ZabLon mwangi",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Absa Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Boaz keronche",
        "contact": "0711222344",
        "property_name": "Boaz keronche",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "KCB",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Clara",
        "contact": "0711222345",
        "property_name": "Clara",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "NCBA",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "koech",
        "contact": "0711222346",
        "property_name": "koech",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "PRIME BANK",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "osim",
        "contact": "0711222347",
        "property_name": "osim",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Co-operative Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Kabui",
        "contact": "0711222348",
        "property_name": "Kabui",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Equity Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Ogega",
        "contact": "0711222349",
        "property_name": "Ogega",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Family Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "John",
        "contact": "0711222350",
        "property_name": "John",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Absa Bank",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Gedion",
        "contact": "0711222351",
        "property_name": "Gedion",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "KCB",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Joseph",
        "contact": "0711222352",
        "property_name": "Joseph",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "NCBA",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Kamotho",
        "contact": "0711222353",
        "property_name": "Kamotho",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "PRIME BANK",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      },
      {
        "landlord_name": "Justus",
        "contact": "0711222354",
        "property_name": "Justus",
        "property_location": "Muranga",
        "commision":6000,
        "payment_date": "05.04.2024",
        "payment_mode": "Bank",
        "bank_name": "Stanbic",
        "account_number": "01192514551000",
        "kplc_meter": "8880888",
        "kplc_units": "888",
        "kplc_amount":800,
        "water_amount":900,
        "water_meter": "9990999",
        "water_units": "999",
        "mri_kra_pin":"7770777",
        "mri_itax_pass":"strong pass",
        "mri_units":"777",
        "mri_amount":700
      }
    ],
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
  
