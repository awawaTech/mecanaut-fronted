<script>
import { CharactersApiService } from "../services/characters-api.service.js";

export default {
  name: "character-detail-view",
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
      this.$router.push({ name: 'characters' });
    },
    editCharacter() {
      this.$router.push({ 
        name: 'character-edit', 
        params: { id: this.character.id } 
      });
    }
  }
};
</script>

<template>
  <div class="character-detail-container">
    <div class="character-detail-header">
      <pv-button 
        icon="pi pi-arrow-left" 
        class="p-button-text" 
        @click="goBack"
        :aria-label="$t('common.back')"
      />
      <h2 class="subtitle">{{ $t('character.details') }}</h2>
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
    
    <div v-else-if="character" class="character-detail-content">
      <div class="character-detail-card">
        <div class="character-image-container">
          <img 
            :src="character.imageUrl || 'https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg'" 
            :alt="character.name"
            class="character-image"
          />
        </div>
        
        <div class="character-info">
          <h2 class="character-name">{{ character.name }}</h2>
          <p class="character-meta">
            ID: {{ character.id }} · 
            {{ $t('character.createdAt') }}: {{ character.createdAt.toLocaleDateString() }}
          </p>
          
          <div class="character-section">
            <h3>{{ $t('character.films') }}</h3>
            <ul v-if="character.films && character.films.length">
              <li v-for="(film, index) in character.films" :key="`film-${index}`">
                {{ film }}
              </li>
            </ul>
            <p v-else class="empty-list">{{ $t('character.noFilms') }}</p>
          </div>
          
          <div class="character-section">
            <h3>{{ $t('character.tvShows') }}</h3>
            <ul v-if="character.tvShows && character.tvShows.length">
              <li v-for="(show, index) in character.tvShows" :key="`show-${index}`">
                {{ show }}
              </li>
            </ul>
            <p v-else class="empty-list">{{ $t('character.noShows') }}</p>
          </div>
          
          <div v-if="character.sourceUrl" class="character-section">
            <h3>{{ $t('character.sourceUrl') }}</h3>
            <a 
              :href="character.sourceUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="source-link"
            >
              {{ character.sourceUrl }}
            </a>
          </div>
          
          <div class="character-actions">
            <pv-button 
              icon="pi pi-pencil" 
              :label="$t('common.edit')" 
              @click="editCharacter"
            />
            <pv-button 
              icon="pi pi-arrow-left" 
              :label="$t('common.back')" 
              class="p-button-secondary" 
              @click="goBack"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-detail-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.character-detail-header {
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

.character-detail-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.character-image-container {
  width: 40%;
  max-width: 400px;
}

.character-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-info {
  flex: 1;
  padding: 2rem;
}

.character-name {
  font-size: 2.5rem;
  color: rgb(84, 41, 129);
  margin: 0 0 0.5rem 0;
}

.character-meta {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.character-section {
  margin-bottom: 2rem;
}

.character-section h3 {
  color: #444;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.empty-list {
  color: #666;
  font-style: italic;
}

.source-link {
  color: rgb(84, 41, 129);
  text-decoration: none;
  word-break: break-all;
}

.source-link:hover {
  text-decoration: underline;
}

.character-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .character-detail-card {
    flex-direction: column;
  }
  
  .character-image-container {
    width: 100%;
    max-width: none;
    height: 300px;
  }
}
</style>
