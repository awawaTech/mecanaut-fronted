<template>
  <div class="not-found-container">
    <div class="content">
      <div class="error-code">404</div>
      <h1 class="title">¡Ups! Página no encontrada</h1>
      <p class="description">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <RouterLink to="/" class="home-button">
        <i class="pi pi-home"></i>
        Volver al inicio
      </RouterLink>
    </div>
    <div class="illustration">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="var(--clr-primary-200)"
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,89.4,-0.3C88.8,15.7,85,31.3,77.1,45.2C69.2,59.1,57.2,71.2,42.8,77.6C28.4,84,14.2,84.7,-0.7,85.9C-15.6,87.1,-31.2,88.8,-45.8,83.4C-60.4,78,-74,65.5,-81.6,49.9C-89.2,34.3,-90.8,15.7,-89.1,-1.9C-87.4,-19.5,-82.4,-36.9,-73.1,-51.7C-63.8,-66.5,-50.2,-78.7,-35.4,-84.5C-20.6,-90.3,-4.6,-89.7,9.2,-84.5C23,-79.3,45.9,-69.5,44.7,-76.4Z"
          transform="translate(100 100)"
        />
      </svg>
      <div class="gear-icon">
        <i class="pi pi-cog"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style scoped lang="scss">
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--clr-bg);
  position: relative;
  overflow: hidden;
}

.content {
  text-align: center;
  z-index: 2;
  max-width: 600px;
  padding: 2rem;
  background: var(--clr-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--clr-primary-100);
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--clr-primary-200), var(--clr-primary-400));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 1rem;
}

.title {
  font-size: 2rem;
  color: var(--clr-text);
  margin-bottom: 1rem;
  font-weight: 600;
}

.description {
  color: var(--clr-text);
  opacity: 0.8;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.home-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--clr-primary-400);
  color: var(--clr-bg);
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: var(--clr-primary-500);
    transform: translateY(-2px);
  }

  i {
    font-size: 1.2rem;
  }
}

.illustration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.1;
  pointer-events: none;

  svg {
    position: absolute;
    width: 600px;
    height: 600px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.gear-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8rem;
  color: var(--clr-primary-200);
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .description {
    font-size: 1rem;
  }

  .illustration svg {
    width: 400px;
    height: 400px;
  }

  .gear-icon {
    font-size: 6rem;
  }
}
</style>
