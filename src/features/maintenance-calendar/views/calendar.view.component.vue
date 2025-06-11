<script>
import search2Component from "../components/search2.component.vue";
import timeSwitcherComponent from "../components/time-switcher.component.vue";
import activityPanelComponent from "../components/activity-panel.component.vue";
import headerPanelComponent from "../../../shared/components/information-panel/header-panel.component.vue";
import HeaderPanel from "@/shared/components/information-panel/header-panel.component.vue";
import CalendarMonthlyComponent from "../components/calendar-monthly.component.vue";
import CalendarWeeklyComponent from "../components/calendar-weekly.component.vue";
import {useI18n} from "vue-i18n";
import {ref} from "vue";
export default {
  name: "calendar-view",
  components: {
    HeaderPanel,
    search2Component,
    timeSwitcherComponent,
    activityPanelComponent,
    headerPanelComponent,
    CalendarMonthlyComponent,
    CalendarWeeklyComponent
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    headerText: {
      type: String,
      default: 'Calendario'
    },
  },
  setup() {
    const isWeeklyView = ref(true); // Estado inicial: vista semanal

    const toggleView = () => {
      isWeeklyView.value = !isWeeklyView.value;
    };

    return {
      isWeeklyView,
      toggleView
    };
  }
}
</script>

<template>
  <div class="header">
      <HeaderPanel class="headerPanel"
          :headerText="headerText"
      />
      <hr class="line">
  </div>
  <div class="hero">
    <div class="view-toggle">
      <button
          class="toggle-option"
          :class="{ 'active': isWeeklyView }"
          @click="isWeeklyView = true"
      >
        Semanal
      </button>
      <button
          class="toggle-option"
          :class="{ 'active': !isWeeklyView }"
          @click="isWeeklyView = false"
      >
        Mensual
      </button>
    </div>
      <search2-component class="search"></search2-component>
  </div>
  <div class="content">
    <calendar-weekly-component v-if="isWeeklyView" class="calendar"></calendar-weekly-component>
    <calendar-monthly-component v-else class="calendar"></calendar-monthly-component>
      <activity-panel-component class="panel"></activity-panel-component>
  </div>
</template>

<style scoped>
.header {
  padding: 1rem;
}
.headerPanel {
  margin: 10px;
}
.line{
  height: 1.3px;
  background-color: var(--clr-gris2);
  border: none;
  opacity: 0.5;
}
.hero{
  display: flex;
  margin: 3vh;
  justify-content: space-between;
  gap: 1vw;
  align-items: center;

}

.content{
  margin: 0;
}
.calendar{
  padding: 1em;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.search{
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.panel{
  position: fixed;
  align-items: center;
  right: 3.6vw;
  top: 35vh;
  justify-content: space-between;
}

/**BOTON SWITCH**/
.view-toggle {
  display: inline-flex;
  background: var(--clr-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 0;
  height: 7vh;
}

.toggle-option {
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  background: transparent;
  color: var(--clr-primary-500);
  border-radius: 5px 0 0 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.toggle-option.active {
  background: var(--clr-primary-100);
  color: var(--clr-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 700;
  border-radius: 5px 5px 5px 5px;
}

</style>