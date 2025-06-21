<template>
  <link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet">
  <div class="container-main">
    <section class="calendar">
      <header class="calendar__header">
        <div class="header__container">
          <button class="calendar__button--previous" @click="prevWeek">
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="container__heading">
            <h2 id="calendar__month">{{ monthName }}</h2>
            <h4 id="calendar__range">{{ weekRange }}</h4>
          </div>
          <button class="calendar__button--next" @click="nextWeek">
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </header>

      <!-- Encabezados de días -->
      <section class="calendar__weekdays">
        <div class="calendar__weekday"><h4>Lunes</h4><abbr>Lun</abbr></div>
        <div class="calendar__weekday"><h4>Martes</h4><abbr>Mar</abbr></div>
        <div class="calendar__weekday"><h4>Miércoles</h4><abbr>Mié</abbr></div>
        <div class="calendar__weekday"><h4>Jueves</h4><abbr>Jue</abbr></div>
        <div class="calendar__weekday"><h4>Viernes</h4><abbr>Vie</abbr></div>
        <div class="calendar__weekday"><h4>Sábado</h4><abbr>Sáb</abbr></div>
        <div class="calendar__weekday"><h4>Domingo</h4><abbr>Dom</abbr></div>
      </section>

      <!-- Celdas de días -->
      <ol class="calendar__days">
        <li
            v-for="(date, index) in weekDates"
            :key="index"
            class="calendar__day"
            :class="{ marked: isDayMarked(date) }"
            @click="handleDayClick(date)"
        >
          <div class="day__info">
            <h5>{{ date.getDate() }}</h5>
          </div>
          <div v-if="getPlansForDay(date).length" class="day-plan">
            <div
                v-for="plan in getPlansForDay(date)"
                :key="plan.planId"
                class="day-plan-item"
            >
              {{ plan.planName }}
            </div>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>

<script>
export default {
  name: "calendar-weekly-component",
  props: {
    plans: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      referenceDate: new Date(today)
    };
  },
  computed: {
    monthName() {
      return this.months[this.referenceDate.getMonth()];
    },
    yearName() {
      return this.referenceDate.getFullYear();
    },
    weekDates() {
      const start = new Date(this.referenceDate);
      const day = start.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      start.setDate(start.getDate() + diff);

      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        d.setHours(0, 0, 0, 0);
        return d;
      });
    },
    weekRange() {
      const format = (d) => {
        const dd = d.getDate().toString().padStart(2, "0");
        const mm = (d.getMonth() + 1).toString().padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      };
      const start = this.weekDates[0];
      const end = this.weekDates[6];
      return `${format(start)} - ${format(end)}`;
    },
    months() {
      return [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
    }
  },
  methods: {
    prevWeek() {
      this.referenceDate.setDate(this.referenceDate.getDate() - 7);
      this.referenceDate = new Date(this.referenceDate);
    },
    nextWeek() {
      this.referenceDate.setDate(this.referenceDate.getDate() + 7);
      this.referenceDate = new Date(this.referenceDate);
    },
    handleDayClick(date) {
      const plan = this.plans.find(p => {
        const start = new Date(p.startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + p.durationDays - 1);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return date >= start && date <= end;
      });

      if (plan) {
        this.$emit('select-day', plan);
      }
    },
    getPlansForDay(date) {
      return this.plans.filter(p => {
        const start = new Date(p.startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + p.durationDays - 1);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return date >= start && date <= end;
      });
    },
    isDayMarked(date) {
      return this.getPlansForDay(date).length > 0;
    }
  }
};
</script>

<style scoped>
  .container-main{
    overflow: hidden;
    width: 75%;
    padding: 2rem;
    container-name: main;
    container-type: inline-size;
    background-color: var(--clr-bg);
    border-radius: var(--radius-md);
  }

  .container__heading{
    color: var(--clr-primary-200);
    font-size: 1.25em;
    display: inline-block;
    text-align: center;
  }

  #calendar__range {
    font-style: italic;
    font-size: 0.8em;
    font-weight: 400;
    color: var(--clr-primary-500);
    margin-top: 0.2em;
  }
  /* Calendar */
  .calendar__header{
    background-color: var(--clr-bg);
    justify-content: center;
    align-items: center;
    position: relative;
  }

  #calendar__week{
    font-style: italic;
    font-size: 0.8em;
    font-weight: 400;
    color: var(--clr-primary-500);
  }

  #calendar__month{
    font-size: 1em;
    color: var(--clr-primary-500);
  }

  .header__container{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 9em;
  }

  .calendar__button--previous, .calendar__button--next{
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    display: flex;
    font-size: 1.25em;
    cursor: pointer;
    color: var(--clr-primary-500);
    background-color: var(--clr-bg);
  }
  .calendar__weekdays, .calendar__days{
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    place-items: center;
  }
  .calendar__weekday{
    padding: 10px 0;
  }
  .calendar__weekdays,
  .calendar__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    place-items: center;
  }

  .calendar__weekday h4{
    display: none;
  }

  .calendar__weekday abbr{
    font-size: 0.875em;
  }


  .calendar__days{
    background-color: var(--clr-bg);
    transition: .3s ease-in-out background-color, .3s ease-in-out border-color;
  }
  .calendar__day{
    width: 100%;
    min-height: 64px;
    max-height: 150px;
    height: 50%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid;
    border-color: var(--clr-primary-300);
  }

  .day__info{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .day__info h5{
    font-size: 0.9375em;
    color: var(--clr-primary-100);
    transition: .3s ease-in-out color;
  }

  .day-plan {
    margin-top: 4px;
    font-size: 0.75em;
    background-color: var(--clr-primary-200);
    padding: 2px;
    border-radius: 3px;
    color: white;
  }

  .day-plan-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @container main (min-width: 874px) {
    .calendar__day {
      min-height: 150px;
      max-height: none;
      gap: 20px;
    }

    .container__heading {
      color: var(--clr-text);
      font-size: 1.5em;
    }

    .calendar__weekday {
      padding: 16px 0;
    }

    .calendar__weekday h4 {
      display: block;
      font-weight: 700;
      color: var(--clr-primary-100);
    }

    .calendar__weekday abbr {
      display: none;
    }

    .day__info h5 {
      font-size: 1em;
      font-weight: 400;
    }
  }
</style>
