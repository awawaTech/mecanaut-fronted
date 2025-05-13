<template>
    <div class="general-container">
      <h2 class="notifications-title">{{ title }}</h2>
      <div class="notifications-container">
        <div class="notifications-list">
          <Notification 
            v-for="(notification, index) in notifications" 
            :key="index"
            :title="notification.title" 
            :message="notification.message" 
            :type="notification.type" 
            :icon="notification.icon" 
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // Importamos el componente Notification
  import Notification from './notification.component.vue';
  
  export default {
    name: 'NotificationContainer',
    components: {
      Notification
    },
    props: {
      title: {
        type: String,
        default: 'Notificaciones'
      },
      notifications: {
        type: Array,
        default: () => []
      }
    }
  }
  </script>
  
  <style scoped>
  .notifications-container {
    background-color: var(--clr-bg);
    padding: 20px;
    border-radius: 15px;
    max-width: 500px;
    margin: 0 auto;
    border: 2px solid #F1E9F7;
  }
  
  .notifications-title {
    color: #4A5568;
    font-size: 18px;
    margin: 0 0 20px 0;
    font-weight: 500;
  }
  
  .notifications-list {
    display: flex;
    flex-direction: column;
  } 
  </style>
  