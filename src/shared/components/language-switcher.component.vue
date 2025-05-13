<script>

import SelectButton from 'primevue/selectbutton'
export default {
  name: "language-switcher",
  components: {
    'pv-select-button': SelectButton
  },
  computed: {
    currentLocale: {
      get() { return this.$i18n.locale },
      set(val) { this.$i18n.locale = val }
    },
    options() {
      return [
        { label: "EN", value: "en" },
        { label: "ES", value: "es" }
      ]
    }
  }
}
</script>
<template>
  <div>
    <span id="lang-switcher-label" class="visually-hidden">
      {{ $t('selectLanguage') }}
    </span>

    <pv-select-button
        v-model="currentLocale"
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
.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
  white-space: nowrap;
}
</style>
