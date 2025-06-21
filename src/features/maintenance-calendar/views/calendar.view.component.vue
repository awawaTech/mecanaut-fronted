<script>
import search2Component from "../components/search2.component.vue";
import timeSwitcherComponent from "../components/time-switcher.component.vue";
import activityPanelComponent from "../components/activity-panel.component.vue";
import HeaderPanel from "@/shared/components/information-panel/header-panel.component.vue";
import CalendarMonthlyComponent from "../components/calendar-monthly.component.vue";
import CalendarWeeklyComponent from "../components/calendar-weekly.component.vue";
import { maintenanceCalendarService } from '../services/maintenance-calendar.service.js';
import { ref, onMounted } from "vue";

export default {
  name: "calendar-view",
  components: {
    HeaderPanel,
    search2Component,
    timeSwitcherComponent,
    activityPanelComponent,
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
    const isWeeklyView = ref(true);
    const maintenancePlans = ref([]);
    const originalPlans = ref([]); // <- Almacena todos los planes originales
    const selectedPlan = ref(null);
    const searchTerm = ref('');

    const toggleView = () => {
      isWeeklyView.value = !isWeeklyView.value;
    };
    const calendarMonthlyRef = ref(null);
    const handleSelectDay = (plan) => {
      selectedPlan.value = plan;
    };


    const handleSearch = (term) => {
      searchTerm.value = term.toLowerCase();
      maintenancePlans.value = originalPlans.value.filter(plan =>
          plan.name.toLowerCase().includes(searchTerm.value)
      );
    };

    onMounted(async () => {
      const plans = await maintenanceCalendarService.getAllPlans();
      maintenancePlans.value = plans;
      originalPlans.value = plans;
    });
    const handleEnter = (term) => {
      handleSearch(term);

      const matchedPlan = originalPlans.value.find(plan =>
          plan.name.toLowerCase().includes(term.toLowerCase())
      );

      if (matchedPlan) {
        isWeeklyView.value = false;
        selectedPlan.value = matchedPlan;

        setTimeout(() => {
          console.log("Matched Plan:", matchedPlan);
          const startDate = new Date(matchedPlan.startDate);
          console.log("Parsed startDate:", startDate);

          if (!isNaN(startDate.getTime())) {
            calendarMonthlyRef.value?.goToMonth(startDate.getMonth(), startDate.getFullYear());
          } else {
            console.warn("Fecha inválida en matchedPlan.startDate:", matchedPlan.startDate);
          }
        }, 0);
      }
    };
    return {
      isWeeklyView,
      toggleView,
      maintenancePlans,
      originalPlans,
      selectedPlan,
      handleSelectDay,
      handleSearch,
      searchTerm,
      calendarMonthlyRef,
      handleEnter,
    };
  }
};
</script>

<template>
  <div class="header">
    <HeaderPanel class="headerPanel" :headerText="headerText" />
    <hr class="line" />
  </div>

  <div class="hero">
    <div class="view-toggle">
      <button class="toggle-option" :class="{ 'active': isWeeklyView }" @click="isWeeklyView = true">Semanal</button>
      <button class="toggle-option" :class="{ 'active': !isWeeklyView }" @click="isWeeklyView = false">Mensual</button>
    </div>
    <search2-component class="search" @search="handleSearch" @enter="handleEnter" />
  </div>

  <div class="content">
    <calendar-weekly-component
        v-if="isWeeklyView"
        class="calendar"
        :plans="maintenancePlans"
        @select-day="handleSelectDay"
    />
    <calendar-monthly-component
        v-else
        ref="calendarMonthlyRef"
        class="calendar"
        :plans="maintenancePlans"
        @select-day="handleSelectDay"
    />
    <activity-panel-component class="panel" :plan="selectedPlan" />
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
