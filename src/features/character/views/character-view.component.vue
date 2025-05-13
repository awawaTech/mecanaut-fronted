<script>
import CharacterList from "../components/character-list.component.vue";
import { CharactersApiService } from "../services/characters-api.service.js";
import CharacterDeleteDialog from "../components/character-delete-dialog.component.vue";

export default {
  name: "characters-view",
  components: { 
    CharacterList,
    CharacterDeleteDialog
  },
  data() {
    return {
      characters: [],
      loading: false,
      error: null,
      deleteDialog: {
        visible: false,
        characterId: null,
        characterName: ""
      }
    };
  },
  async created() {
    await this.loadCharacters();
  },
  methods: {
    async loadCharacters() {
      this.loading = true;
      try {
        this.characters = await CharactersApiService.getCharacters();
      } catch (err) {
        this.error = err.message || "Error al cargar personajes";
        console.error("Error:", err);
      } finally {
        this.loading = false;
      }
    },
    createCharacter() {
      this.$router.push({ name: 'character-create' });
    },
    editCharacter(id) {
      this.$router.push({ name: 'character-edit', params: { id } });
    },
    viewCharacter(id) {
      this.$router.push({ name: 'character-detail', params: { id } });
    },
    showDeleteDialog(character) {
      this.deleteDialog = {
        visible: true,
        characterId: character.id,
        characterName: character.name
      };
    },
    cancelDelete() {
      this.deleteDialog.visible = false;
    },
    async confirmDelete() {
      this.loading = true;
      try {
        await CharactersApiService.deleteCharacter(this.deleteDialog.characterId);
        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `${this.deleteDialog.characterName} ha sido eliminado`,
          life: 3000
        });
        await this.loadCharacters();
      } catch (err) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error al eliminar: ${err.message}`,
          life: 3000
        });
      } finally {
        this.deleteDialog.visible = false;
        this.loading = false;
      }
    }
  }
};
</script>

<template>
  <div class="characters-container">
    <div class="characters-header">
      <h2 class="subtitle">Lista de personajes</h2>
      <pv-button 
        icon="pi pi-plus" 
        label="Crear personaje" 
        @click="createCharacter"
      />
    </div>
    
    <div v-if="loading" class="loading-container">
      <pv-progress-spinner />
      <p>Cargando...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <pv-message severity="error" :closable="false">
        {{ error }}
      </pv-message>
    </div>
    
    <div v-else-if="characters.length === 0" class="empty-container">
      <p>No hay personajes</p>
      <pv-button 
        icon="pi pi-plus" 
        label="Crear personaje" 
        @click="createCharacter"
      />
    </div>
    
    <div v-else class="characters-content">
      <div class="character-actions">
        <div 
          v-for="character in characters" 
          :key="character.id"
          class="character-card"
        >
          <div class="character-card-inner">
            <img 
              :src="character.imageUrl || 'https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg'" 
              :alt="character.name"
              class="character-thumbnail"
            />
            <div class="character-info">
              <h3>{{ character.name }}</h3>
              <div class="character-buttons">
                <pv-button 
                  icon="pi pi-eye" 
                  class="p-button-rounded p-button-info" 
                  @click="viewCharacter(character.id)"
                  :aria-label="`Ver ${character.name}`"
                />
                <pv-button 
                  icon="pi pi-pencil" 
                  class="p-button-rounded p-button-success" 
                  @click="editCharacter(character.id)"
                  :aria-label="`Editar ${character.name}`"
                />
                <pv-button 
                  icon="pi pi-trash" 
                  class="p-button-rounded p-button-danger" 
                  @click="showDeleteDialog(character)"
                  :aria-label="`Eliminar ${character.name}`"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <character-delete-dialog
      :visible="deleteDialog.visible"
      :characterName="deleteDialog.characterName"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<style scoped>
.characters-container {
  padding: 1rem;
  min-height: 50vh;
}

.characters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 2.2em;
  font-weight: 700;
  color: rgb(84, 41, 129);
  margin: 0;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
  gap: 1rem;
}

.error-container {
  max-width: 600px;
  margin: 0 auto;
}

.characters-content {
  margin-top: 1rem;
}

.character-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.character-card {
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  background-color: white;
  overflow: hidden;
}

.character-card-inner {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.character-thumbnail {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.character-info {
  flex: 1;
}

.character-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.character-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>
