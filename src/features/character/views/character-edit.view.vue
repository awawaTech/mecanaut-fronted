<script>
import CharacterForm from "../components/character-form.component.vue";
import { CharactersApiService } from "../services/characters-api.service.js";

export default {
  name: "character-edit-view",
  components: { CharacterForm },
  data() {
    return {
      character: null,
      loading: false,
      error: null
    };
  },
  async created() {
    await this.loadCharacter();
  },
  methods: {
    async loadCharacter() {
      this.loading = true;
      const id = parseInt(this.$route.params.id);
      
      try {
        this.character = await CharactersApiService.getCharacterById(id);
        
        if (!this.character) {
          this.error = `No se encontró el personaje con ID ${id}`;
        }
      } catch (err) {
        this.error = err.message || "Error al cargar el personaje";
        console.error("Error:", err);
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    async handleSubmit(characterData) {
      this.loading = true;
      try {
        await CharactersApiService.updateCharacter(this.character.id, characterData);
        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Personaje ${characterData.name} actualizado correctamente`,
          life: 3000
        });
        this.$router.push({ name: 'character-detail', params: { id: this.character.id } });
      } catch (err) {
        this.error = err.message || "Error al actualizar el personaje";
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
  <div class="character-edit-container">
    <div class="character-edit-header">
      <pv-button 
        icon="pi pi-arrow-left" 
        class="p-button-text" 
        @click="goBack"
        :aria-label="$t('common.back')"
      />
      <h2 class="subtitle">{{ $t('character.edit') }}</h2>
    </div>
    
    <div v-if="loading" class="loading-container">
      <pv-progress-spinner />
      <p>{{ $t('common.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <pv-message severity="error" :closable="false">
        {{ error }}
      </pv-message>
      <pv-button 
        icon="pi pi-arrow-left"
        :label="$t('common.back')"
        @click="goBack"
      />
    </div>
    
    <div v-else-if="character" class="character-edit-content">
      <character-form 
        :character="character"
        :isEdit="true"
        @submit="handleSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<style scoped>
.character-edit-container {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.character-edit-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.subtitle {
  font-size: 2rem;
  font-weight: 700;
  color: rgb(84, 41, 129);
  margin: 0 0 0 1rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
  gap: 1rem;
}

.character-edit-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  padding: 2rem;
}
</style>
