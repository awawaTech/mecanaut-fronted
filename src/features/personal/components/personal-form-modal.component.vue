<script>
import { ref, onMounted } from 'vue';
import Button from '../../../shared/components/button.component.vue';

export default {
  name: 'PersonalFormModal',

  components: {
    Button
  },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    personalData: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['submit', 'cancel', 'delete'],

  setup(props, { emit }) {
    const formData = ref({
      code:'',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: ''
    });

    const handleSubmit = () => {
      const requiredFields = props.isEdit 
        ? ['firstName', 'lastName', 'email', 'role']
        : ['code', 'firstName', 'lastName', 'email', 'password', 'role'];
      
      const missing = requiredFields.filter(field => !formData.value[field] || formData.value[field].toString().trim() === '');

      if (missing.length > 0) {
        alert('Please fill in all the required fields.');
        return;
      }

      emit('submit', {
        ...formData.value,
        id: props.personalData?.id
      });
    };

    const handleCancel = () => {
      emit('cancel');
    };

    const handleDelete = () => {
      if (confirm('Are you sure you want to delete this person?')) {
        emit('delete', props.personalData.id);
      }
    };

    onMounted(() => {
      if (props.isEdit && props.personalData) {
        formData.value = {
          code: props.personalData.code || '',
          firstName: props.personalData.firstName,
          lastName: props.personalData.lastName,
          email: props.personalData.email,
          role: props.personalData.role
        };
      }
    });

    return {
      formData,
      handleSubmit,
      handleCancel,
      handleDelete
    };
  }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Edit Personal' : 'New Personal' }}</h2>
        <button class="close-button" @click="handleCancel">×</button>
      </div>

      <div class="modal-content">
        <form @submit.prevent="handleSubmit" class="form-container">
          <div class="form-group">
            <label for="code">Username</label>
            <input id="code" v-model="formData.code" type="text" required placeholder="Enter username" :readonly="isEdit" />
          </div>
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input id="firstName" v-model="formData.firstName" type="text" required placeholder="Enter first name" />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input id="lastName" v-model="formData.lastName" type="text" required placeholder="Enter last name" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="formData.email" type="email" required placeholder="Enter email" />
          </div>
          <div class="form-group" v-if="!isEdit">
            <label for="password">Password</label>
            <input id="password" v-model="formData.password" type="password" required placeholder="Enter password" />
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" v-model="formData.role" required>
              <option disabled value="">Select role</option>
              <option value="RoleTechnical">Technical</option>
              <option value="RoleAdmin">Administrator</option>
            </select>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <Button variant="outline" @clicked="handleCancel">
          Cancel
        </Button>
        <Button
            v-if="isEdit"
            variant="danger"
            style="background-color: var(--clr-danger);"
            @clicked="handleDelete"
        >
          Delete
        </Button>
        <Button variant="primary" @clicked="handleSubmit">
          {{ isEdit ? 'Save Changes' : 'Create' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: var(--clr-bg);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--clr-border);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--clr-text);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--clr-text);
  padding: 0.5rem;
}

.modal-content {
  padding: 1rem;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--clr-border);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--clr-text);
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid var(--clr-primary-100);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--clr-text);
  background-color: var(--clr-surface);
}

.form-group input[readonly] {
  background-color: var(--clr-surface-100);
  color: var(--clr-text-muted);
  cursor: not-allowed;
}
</style>
