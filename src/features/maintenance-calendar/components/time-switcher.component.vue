<script>

import SelectButton from 'primevue/selectbutton'
export default {
  name: "time-switcher",
  components: {
    'pv-select-button': SelectButton
  },
  computed: {
    options() {
      return [
        { label: "Mensual", value: "monthly" },
        { label: "Semanal", value: "semanal" }
      ]
    }
  }
}
</script>
<template>
  <div>
    <pv-select-button
        :options="options"
        option-label="label"
        option-value="value"
        class="uppercase"
        role="radiogroup"
        aria-labelledby="lang-switcher-label"
    />
  </div>
</template>


<style scoped>

.uppercase {
  display: flex;
  background-color: var(--clr-primary-100);
}
</style>
