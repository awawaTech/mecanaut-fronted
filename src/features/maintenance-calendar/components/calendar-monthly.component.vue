<template>
  <link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet">
  <div class="container-main">
    <section class="calendar">
      <header class="calendar__header">
        <div class="header__container">
          <button class="calendar__button--previous" @click="prevMonth">
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="container__heading">
            <h2 id="calendar__month">{{ monthName }}</h2>
            <h3 id="calendar__year">{{ yearName }}</h3>
          </div>
          <button class="calendar__button--next" @click="nextMonth">
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </header>

      <section class="calendar__weekdays">
        <div class="calendar__weekday"><h4>Lunes</h4></div>
        <div class="calendar__weekday"><h4>Martes</h4></div>
        <div class="calendar__weekday"><h4>Miércoles</h4></div>
        <div class="calendar__weekday"><h4>Jueves</h4></div>
        <div class="calendar__weekday"><h4>Viernes</h4></div>
        <div class="calendar__weekday"><h4>Sábado</h4></div>
        <div class="calendar__weekday"><h4>Domingo</h4></div>
      </section>

      <ol class="calendar__days">
        <li
            v-for="(day, index) in daysArray"
            :key="index"
            class="calendar__day"
            :class="{ marked: markedDays.has(day) }"
            @click="day ? handleDayClick(day) : null"
        >
          <div class="day__info">
            <h5 v-if="day">{{ day }}</h5>
          </div>
          <div v-if="day && getPlansForDay(day).length > 0" class="day-plan">
            <div
                v-for="plan in getPlansForDay(day)"
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
    name: "calendar-monthly-component",
    props: {
      plans: {
        type: Array,
        default: () => []
      }
    },
    data() {
      const today = new Date();
      return {
        currentMonth: today.getMonth(),
        currentYear: today.getFullYear()
      };
    },
    computed: {
      monthName() {
        return this.months[this.currentMonth];
      },
      yearName() {
        return this.currentYear;
      },
      daysInMonth() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        return { firstDay, totalDays };
      },
      daysArray() {
        const { firstDay, totalDays } = this.daysInMonth;
        const adjustedStart = (firstDay + 6) % 7;
        const days = [];

        for (let i = 0; i < adjustedStart; i++) {
          days.push(null);
        }

        for (let d = 1; d <= totalDays; d++) {
          days.push(d);
        }

        return days;
      },
      months() {
        return [
          "Enero", "Febrero", "Marzo", "Abril",
          "Mayo", "Junio", "Julio", "Agosto",
          "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
      },
      markedDays() {
        const marked = new Set();
        this.plans.forEach(plan => {
          const start = new Date(plan.startDate);
          const end = new Date(start);
          end.setDate(start.getDate() + plan.durationDays - 1);

          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            if (d.getMonth() === this.currentMonth && d.getFullYear() === this.currentYear) {
              marked.add(d.getDate());
            }
          }
        });
        return marked;
      }
    },
    methods: {
      prevMonth() {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
      },
      nextMonth() {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
      },
      handleDayClick(day) {
        const selectedDate = new Date(this.currentYear, this.currentMonth, day);
        selectedDate.setHours(0, 0, 0, 0);

        const selectedPlan = this.plans.find((p) => {
          const planStart = new Date(p.startDate);
          const planEnd = new Date(planStart);
          planStart.setHours(0, 0, 0, 0);
          planEnd.setDate(planEnd.getDate() + p.durationDays - 1);
          planEnd.setHours(0, 0, 0, 0);

          return selectedDate >= planStart && selectedDate <= planEnd;
        });

        if (selectedPlan) {
          this.$emit('select-day', selectedPlan);
        }
      },
      getPlansForDay(day) {
        const date = new Date(this.currentYear, this.currentMonth, day);
        date.setHours(0, 0, 0, 0);

        return this.plans.filter((p) => {
          const start = new Date(p.startDate);
          const end = new Date(start);
          start.setHours(0, 0, 0, 0);
          end.setDate(start.getDate() + p.durationDays - 1);
          end.setHours(0, 0, 0, 0);

          return date >= start && date <= end;
        });
      },
      goToMonth(month, year) {
        this.currentMonth = month;
        this.currentYear = year;
      }
    }
  };
</script>

<style scoped>
  .container-main {
    overflow: hidden;
    width: 75%;
    padding: 2rem;
    background-color: var(--clr-bg);
    border-radius: var(--radius-md);
    container-name: main;
    container-type: inline-size;
  }
  .container__heading {
    color: var(--clr-primary-200);
    font-size: 1.25em;
    text-align: center;
    display: inline-block;
  }
  .calendar__header {
    position: relative;
    justify-content: center;
    align-items: center;
    background-color: var(--clr-bg);
  }
  .header__container{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 9em;
  }
  /* Calendar */
  .calendar__header{
    background-color: var(--clr-bg);
    justify-content: center;
    align-items: center;
    position: relative;
  }
  #calendar__year{
    font-style: italic;
    font-size: 0.8em;
    font-weight: 400;
    color: var(--clr-primary-500);
  }

  #calendar__month{
    font-size: 1em;
    color: var(--clr-primary-500);
  }

  .calendar__button--previous, .calendar__button--next {
    width: 2rem;
    height: 3vh;
    border: none;
    border-radius: 50%;
    font-size: 1.25em;
    cursor: pointer;
    background-color: var(--clr-bg);
    color: var(--clr-primary-500);
    padding-top: 1rem;
    display: flex;
  }

  .calendar__weekdays, .calendar__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    place-items: center;
  }

  .calendar__weekday{
    padding: 10px 0;

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

  @container main (min-width: 874px){
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
