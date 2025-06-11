<script>
export default {
  name: "calendar.component",
  data() {
    const today = new Date();
    return {
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
      currentWeek: 0, // Semana actual dentro del mes (0-based)
    };
  },
  computed: {
    monthName() {
      return this.months[this.currentMonth];
    },
    weekRange() {
      const startDate = this.getStartOfWeek();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    },
    daysInMonth() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      return { firstDay, totalDays };
    },
    daysArray() {
      const startDate = this.getStartOfWeek();
      const days = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        days.push(currentDate.getDate());
      }

      return days;
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
    getStartOfWeek() {
      // Calcula el primer día de la semana actual (lunes)
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
      const firstDayOfWeek = firstDayOfMonth.getDay();

      // Ajuste para que Lunes sea el primer día (0)
      const adjustedFirstDay = (firstDayOfWeek + 6) % 7;

      const startDate = new Date(this.currentYear, this.currentMonth,
          1 + (this.currentWeek * 7) - adjustedFirstDay);

      // Asegurarse de que no nos salimos del mes anterior
      if (startDate.getMonth() < this.currentMonth) {
        startDate.setDate(1);
      }

      return startDate;
    },
    prevWeek() {
      const startDate = this.getStartOfWeek();
      startDate.setDate(startDate.getDate() - 7);

      if (startDate.getMonth() !== this.currentMonth) {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
        // Ir a la última semana del mes anterior
        this.currentWeek = this.getTotalWeeksInMonth() - 1;
      } else {
        this.currentWeek--;
      }
    },
    nextWeek() {
      const startDate = this.getStartOfWeek();
      startDate.setDate(startDate.getDate() + 7);

      if (startDate.getMonth() !== this.currentMonth) {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
        // Ir a la primera semana del siguiente mes
        this.currentWeek = 0;
      } else {
        this.currentWeek++;
      }
    },
    getTotalWeeksInMonth() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

      // Ajuste para que Lunes sea el primer día (0)
      const adjustedFirstDay = (firstDay + 6) % 7;

      return Math.ceil((adjustedFirstDay + totalDays) / 7);
    }
  }
};
</script>

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
            <h3 id="calendar__week">{{ weekRange }}</h3>
          </div>
          <button class="calendar__button--next" @click="nextWeek">
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </header>

      <!-- Días de la semana -->
      <section class="calendar__weekdays">
        <div class="calendar__weekday"><h4>Lunes</h4><abbr>Lun</abbr></div>
        <div class="calendar__weekday"><h4>Martes</h4><abbr>Mar</abbr></div>
        <div class="calendar__weekday"><h4>Miércoles</h4><abbr>Mié</abbr></div>
        <div class="calendar__weekday"><h4>Jueves</h4><abbr>Jue</abbr></div>
        <div class="calendar__weekday"><h4>Viernes</h4><abbr>Vie</abbr></div>
        <div class="calendar__weekday"><h4>Sábado</h4><abbr>Sáb</abbr></div>
        <div class="calendar__weekday"><h4>Domingo</h4><abbr>Dom</abbr></div>
      </section>

      <!-- Días del mes -->
      <ol class="calendar__days">
        <li v-for="(day, index) in daysArray" :key="index" class="calendar__day" :data-day="day">
          <div class="day__info">
            <h5>{{ day }}</h5>
          </div>
        </li>
      </ol>
    </section>
  </div>
  <footer>
    <div class="plan">
      <i class="pi pi-calendar" id="icon-calendar"></i>
      <p>Plan de mantenimiento</p>
    </div>
    <div class="order">
      <i class="pi pi-bell" id="icon-bell"></i>
      <p>Orden de trabajo</p>
    </div>
  </footer>
</template>

<style scoped>
.container-main, footer{
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
/* Footer */
footer{
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.plan, .order{
  display: flex;
  gap: 3em;
  align-items: center;
}

#icon-bell, #icon-calendar{
  color: var(--clr-bg);
  border-radius: 20%;
  padding: 0.5em;
  font-size: 1.4em;
}
#icon-bell{
  background-color: var(--clr-primary-500);
}
#icon-calendar{
  background-color: var(--clr-primary-100);
}
</style>