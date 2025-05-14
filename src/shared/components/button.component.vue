<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'danger', 'success', 'outline'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    },
    radius: {
      type: String,
      default: 'md',
      validator: value => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    iconLeft: {
      type: String,
      default: ''
    },
    iconRight: {
      type: String,
      default: ''
    }
  },
  emits: ['clicked'],
  methods: {
    handleClick(event) {
      this.$emit('clicked', event);
    }
  }
}
</script>

<template>
  <button 
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      `radius-${radius}`,
      { 'disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <i v-if="iconLeft" :class="iconLeft" class="icon-left"></i>
    <slot></slot>
    <i v-if="iconRight" :class="iconRight" class="icon-right"></i>
  </button>
</template>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.5rem;

  &-primary {
    background: var(--clr-primary-400);
    color: var(--clr-bg);
    
    &:hover:not(.disabled) {
      background: var(--clr-primary-500);
    }
  }

  &-secondary {
    background: var(--clr-surface);
    color: var(--clr-text);
    border: 1px solid var(--clr-primary-100);
    
    &:hover:not(.disabled) {
      background: var(--clr-primary-100);
      color: var(--clr-bg);
    }
  }
  
  &-outline {
    background: transparent;
    color: var(--clr-primary-400);
    border: 1px solid var(--clr-primary-400);
    
    &:hover:not(.disabled) {
      background: var(--clr-primary-100);
      color: var(--clr-bg);
      border-color: var(--clr-primary-100);
    }
  }

  &-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  &-md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  &-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  &.radius {
    &-none { border-radius: 0; }
    &-sm { border-radius: 0.25rem; }
    &-md { border-radius: 0.5rem; }
    &-lg { border-radius: 1rem; }
    &-full { border-radius: 9999px; }
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .icon-left {
    margin-right: 0.3rem;
  }
  
  .icon-right {
    margin-left: 0.3rem;
  }
}
</style>
