<script>
import CharacterForm from "../components/character-form.component.vue";
import { CharactersApiService } from "../services/characters-api.service.js";
import { CharacterEntity } from "../models/character.entity.js";

export default {
  name: "character-create-view",
  components: { CharacterForm },
  data() {
    return {
      loading: false,
      error: null,
      success: false,
      newCharacter: new CharacterEntity({})
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async handleSubmit(characterData) {
      this.loading = true;
      this.error = null;
      
      try {
        await CharactersApiService.createCharacter(characterData);
        this.success = true;
        
        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Personaje ${characterData.name} creado correctamente`,
          life: 3000
        });
        
        // Redirección después de un breve retraso
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500);
      } catch (err) {
        this.error = err.message || "Error al crear el personaje";
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error,
          life: 3000
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<template>
  <div class="character-create-container">
    <div class="character-create-header">
      <pv-button 
        icon="pi pi-arrow-left" 
        class="p-button-text" 
        @click="goBack"
        aria-label="Regresar"
      />
      <h2 class="subtitle">Crear personaje</h2>
    </div>
    
    <div v-if="loading" class="loading-container">
      <pv-progress-spinner />
      <p>Cargando...</p>
    </div>
    
    <div v-else-if="success" class="success-container">
      <pv-message severity="success" :closable="false">
        Personaje creado con éxito
      </pv-message>
      <p>Regresando al listado...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <pv-message severity="error" :closable="false">
        {{ error }}
      </pv-message>
      <pv-button 
        icon="pi pi-refresh" 
        label="Intentar nuevamente"
        @click="error = null"
        class="p-mt-3"
      />
    </div>
    
    <div v-else class="character-create-content">
      <character-form 
        :character="newCharacter"
        @submit="handleSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<style scoped>
.character-create-container {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.character-create-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.subtitle {
  font-size: 2rem;
  font-weight: 700;
  color: rgb(84, 41, 129);
  margin: 0 0 0 1rem;
}

.loading-container,
.error-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
  gap: 1rem;
}

.character-create-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  padding: 2rem;
}
</style>
