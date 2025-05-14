<template>
    <div 
      :class="getNotificationClass" 
      class="notification-item" 
      v-ripple="{ color: 'rgba(0, 0, 0, 0.2)' }" 
      tabindex="0" 
      role="button">
      
      <div :class="getIconClass" class="notification-icon">
        <i class="pi pi-exclamation-circle"></i>
      </div>
      
      <div class="notification">
        <h3 class="notification-title">{{ title }}</h3>
        <p class="notification-message">{{ message }}</p>
      </div>
      
    </div>
  </template>
  
  <script>
  import VueRipple from 'vue-ripple-directive';

  export default {
    name: 'Notification',
    directives: {
    ripple: VueRipple
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      message: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'notification'
      },
      icon: {
        type: String,
        default: 'notifications'
      }
    },
    computed: {
      getNotificationClass() {
        return `notification-${this.type}`;
      },
      getIconClass() {
        return `icon-${this.type}`;
      }
    }
  }
  </script>
  
  <style scoped>
  .notification-item {
    font-size: 0.9em;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
    margin-bottom: 1rem;
    padding: 1rem;
    gap: 1.3rem;
    
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
    overflow: visible;
    
    &:hover {
      background-color: #f5f5f5; 
      transform: translateY(-2px); 
      box-shadow: 0 0.35rem 0.35rem rgba(0, 0, 0, 0.3);
    }
  }
  
  .notification-icon {
    flex: 0 0 auto;
    width: 3.7rem;
    height: 3.7rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
  
  .notification-icon .material-icons {
    font-size: 2rem;
  }
  
  .notification-title {
    font-size: 1.15em;
    font-weight: 700;
    margin: 0 0 0.1rem;
  }
  
  .notification-message {
    font-size: 0.95em;
    margin: 0;
    color: #383A37;
  }
  
  .notification-error .notification-icon {
    background-color: #D7465E;
  }
  
  .notification-error .notification-title {
    color: #D7465E;
  }
  
  .notification-notification .notification-icon {
    background-color: #5B62B3;
  }
  
  .notification-notification .notification-title {
    color: #5B62B3;
  }


  </style>
  