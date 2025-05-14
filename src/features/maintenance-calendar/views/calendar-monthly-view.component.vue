<script>
import search2Component from "../components/search2.component.vue";
import timeSwitcherComponent from "../components/time-switcher.component.vue";
import activityPanelComponent from "../components/activity-panel.component.vue";
import headerPanelComponent from "../../../shared/components/information-panel/header-panel.component.vue";
import HeaderPanel from "@/shared/components/information-panel/header-panel.component.vue";
import calendarComponent from "../components/calendar.component.vue";
export default {
  name: "calendar-monthly",
  components: {
    HeaderPanel,
    search2Component,
    timeSwitcherComponent,
    activityPanelComponent,
    headerPanelComponent,
    calendarComponent
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    headerText: {
      type: String,
      default: 'Calendar'
    },
  }
}
</script>

<template>
  <div class="header">
    <HeaderPanel
        :headerText="headerText"
    />
  </div>
  <div class="hero">
    <time-switcher-component class="switcher"></time-switcher-component>
    <search2-component></search2-component>
  </div>
  <div class="content">
    <calendar-component class="calendar"></calendar-component>
    <activity-panel-component class="panel"></activity-panel-component>

  </div>

</template>

<style scoped>
.hero{
  display: flex;
}
.switcher{
  padding: 10px;
}
.panel{
  position: fixed;
  align-items: center;
  right: 3%;
  top: 25%
}
.calendar{
  padding: 2%;
}
</style>