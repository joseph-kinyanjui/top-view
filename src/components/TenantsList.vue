<script setup>
import { computed } from 'vue';

const total_rent_collected = computed(() => {
  return tenant.reduce((acc, item) => acc + item.rent_paid, 0);
});

const total_unpaid_rent = computed(() => {
  return tenant.reduce((acc, item) => acc + item.unpaid_rent, 0);
});


const total_deposit_held = computed(() => {
  return tenant.reduce((acc, item) => acc + item.deposit_held, 0);
});

const total_arrears = computed(() => {
  return tenant.reduce((acc, item) => acc + item.arrears, 0);
});

const total_arrears_cf = computed(() => {
  return tenant.reduce((acc, item) => acc + item.arrears_cf, 0);
});

</script>

/*HTML*/
<template>
  <div class="back_to_properties_list">
    <RouterLink to="/">Back to Properties List</RouterLink>
  </div>
  <div class="tenant">
    <table style="width:100%">
      <tr>
        <th class="property_name">Property Name: </th>
        <th class="hse_number">Hse Number: </th>
        <th class="tenant_name">Tenant's name </th>
        <th class="house_rate">Rate </th>
        <th class="rent_paid">Rent Paid </th>
        <th class="unpaid_rent">Unpaid Rent</th>
        <th class="deposit_held">Deposit Paid</th>
        <th class="arrears">Arrears BF</th>
        <th class="arrears_cf"> Arrears CF:</th>
        <th class="tenant_number">Contact:</th>
        <th class="alternative_number">Alternative number </th>
        <th class="id_number">Id Number</th>
      </tr>
      <tr class="house" v-for="hse in tenant" :key="hse.hse_number">

        <td class="hse_number">{{ hse.property_name }} </td>
        <td class="hse_number">{{ hse.hse_number }} </td>
        <td class="tenant_name">{{ hse.tenant_name }} </td>
        <td class="house_rate">{{ hse.house_rate }} </td>
        <td class="rent_paid">{{ hse.rent_paid }}</td>
        <td class="unpaid_rent">{{ hse.unpaid_rent }}</td>
        <td class="deposit_held">{{ hse.deposit_held }}</td>
        <td class="arrears"> {{ hse.arrears }}</td>
        <td class="arrears_cf"> {{ hse.arrears_cf }}</td>
        <td class="tenant_number">{{ hse.tenant_number }} </td>
        <td class="alternative_number">{{ hse.alternative_number }} </td>
        <td class="id_number">{{ hse.id_number }} </td>
      </tr>

      <tr>
        <td>Totals</td>
        <td>All Houses</td>
        <td>-</td>
        <td>{{ total_rent_collected }}</td>
        <td>{{ total_unpaid_rent }}</td>
        <td>{{ total_deposit_held }}</td>
        <td>{{ total_arrears }}</td>
        <td>{{ total_arrears_cf }}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

    </table>

  </div>


</template>

<style scoped>
.house div,
.hse_header div,
table,
td,
th {
  border: 1px solid purple;
  padding: 1em;
  width: 10em;
}
</style>
