<script>
  export default {
    name: "calendar.component",
    data() {
      const today = new Date();
      return {
        currentMonth: today.getMonth(), // 0 = Enero
        currentYear: today.getFullYear(),
      };
    },
    computed: {
      monthName() {
        return this.months[this.currentMonth] + ' - ' + this.currentYear;
      },
      daysInMonth() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        return { firstDay, totalDays };
      },
      daysArray() {
        const { firstDay, totalDays } = this.daysInMonth;

        // Ajuste para que Lunes sea 0, Domingo 6
        const adjustedStart = (firstDay + 6) % 7;
        const days = [];

        for (let i = 0; i < adjustedStart; i++) {
          days.push(null); // espacios vacíos
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
            <button class="calendar__button calendar__button--previous" @click="prevMonth" aria-label="Ir al Anterior Mes">
              <i class="ri-arrow-left-s-line"></i>
            </button>
            <h3 class="container__heading" id="calendar-date">{{ monthName }}</h3>
            <button class="calendar__button calendar__button--next" @click="nextMonth" aria-label="Ir al Siguiente Mes">
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
              <h5 v-if="day">{{ day }}</h5>
            </div>
          </li>
        </ol>
      </section>
    </div>
</template>

<style scoped>
  .container-main{
    overflow: hidden;
    width: 75%;
    padding: 0;
    container-name: main;
    container-type: inline-size;
  }

  .container__heading{
    color: var(--clr-primary-200);
    font-size: 1.25em;
  }

  /* Calendar */
  .calendar__header{
    background-color: var(--clr-primary-100);
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .header__container{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .calendar__button{
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background-color: var(--clr-bg);
    color: var(--clr-primary-300);
    display: grid;
    place-items: center;
    font-size: 1.25em;
    cursor: pointer;
    transition: .3s ease-in-out scale;
  }

  .calendar__button:hover, .calendar__button:focus{
    scale: 1.05;
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
    color: var(--clr-color);
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
    border: 1px solid #E6E6E6;
  }

  .day__info{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .day__info h5{
    font-size: 0.9375em;
    color: var(--clr-text);
    transition: .3s ease-in-out color;
  }

  .day__info button{
    background: none;
    border: none;
    font-size: 1.125em;
    color: var(--clr-primary-200);
    cursor: pointer;
    transition: .3s ease-in-out color;
  }



  .calendar__day--content:hover .day__info h5,
  .calendar__day--content:focus .day__info h5,
  .calendar__day--content:hover .day__info button,
  .calendar__day--content:focus .day__info button{
    color: var(--clr-text);
  }

  @container main (min-width: 400px){
    .calendar__day{
      padding: 10px;
    }
  }

  @container main (min-width: 500px){
    .calendar__header{
      padding: 0 48px;
    }

    .calendar__day{
      aspect-ratio: 1/1;
      padding: 10px 16px;
    }

    .day__info h5{
      font-size: 1.125em;
    }

    .day__info button{
      font-size: 1.25em;
    }

    .calendar__button{
      width: 28px;
      height: 28px;
      font-size: 24px;
    }
  }

  @container main (min-width: 874px) {
    .calendar__day {
      min-height: 150px;
      max-height: none;
      aspect-ratio: auto;
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
      font-weight: 400;
      color: var(--clr-text);
    }

    .calendar__weekday abbr {
      display: none;
    }

    .day__info h5 {
      font-size: 1.375em;
    }

    .day__info button {
      display: none;
    }


    .calendar__day--content:hover .day__info h5,
    .calendar__day--content:focus .day__info h5,
    .calendar__day--content:hover .day__info button,
    .calendar__day--content:focus .day__info button {
      color: initial;
    }

    .calendar__appointments li {
      padding: 4px 8px;
      font-size: 0.75em;
      color: var(--clr-primary-100);
      border-radius: 12px;
      transition: .3s ease-in-out transform, .3s ease-in-out box-shadow;
    }

    .calendar__appointments li button {
      width: 100%;
      max-width: 100px;
      background: none;
      border: none;
      text-align: left;
      display: flex;
      gap: 4px;
      overflow: hidden;
      cursor: pointer;
    }

    .calendar__appointments li button .appointment-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      min-width: 0;
    }

    .appointment__completada i {
      color: var(--clr-primary-100);
    }

    .appointment__pendiente i {
      color: var(--clr-primary-100);
    }

    .calendar__button {
      width: 32px;
      height: 32px;
      font-size: 1.75em;
    }

    .drag__over .day__info h5 {
      color: var(--clr-text);
    }
  }

  @container main (min-width: 1080px){
    .calendar__appointments li{
      max-width: 3%;
      font-size: 0.875em;
    }
  }
</style>