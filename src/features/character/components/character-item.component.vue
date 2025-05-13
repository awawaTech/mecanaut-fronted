<script>
import { CharacterEntity } from "../models/character.entity.js";

export default {
  name: "character-item",
  props: {
    character: { type: CharacterEntity, required: true }
  },
  methods: {
    openFandom() {
      window.open("https://disney.fandom.com", "_blank");
    }
  }
}
</script>

<template>
  <pv-card class="p-shadow-3 card-custom" role="group" :aria-label="`Character ${character.name}`">
    <template #header>
      <img
          :src="character.imageUrl || 'https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg'"
          class="card-image"
          :alt="`Imagen de ${character.name}`"
      />
    </template>

    <template #title>
      <span class="card-title">{{ character.name }}</span>
    </template>

    <template #subtitle>
      <span class="card-subtitle">
        ID: {{ character.id }} · {{ $t('episode.createdAt')}}: {{ character.createdAt.toLocaleDateString() }}
      </span>
    </template>


    <template #content>
      <div class="text-sm mb-2">
        <p><strong>{{ $t('episode.movies')}}:</strong></p>
        <ul>
          <li v-for="(film, index) in character.films" :key="`film-${index}`">{{ film }}</li>
        </ul>

        <p><strong>Series:</strong></p>
        <ul>
          <li v-for="(show, index) in character.tvShows" :key="`tv-${index}`">{{ show }}</li>
        </ul>

        <p v-if="character.sourceUrl">
          <a class="my_button_a" :href="character.sourceUrl" target="_blank" rel="noopener">
            {{ $t('episode.a')}}
          </a>
        </p>
      </div>
    </template>


    <template #footer>
      <pv-button
          icon="pi pi-external-link"
          :label="$t('episode.button')"
          class="button_view"
          @click="openFandom"
          aria-label="Buscar en Disney Fandom"
      />
    </template>
  </pv-card>
</template>

<style scoped>
.my_button_a{
  text-decoration: none;
  color: #fa496b;
  font-weight: bold;
}
.card-custom {
  width: 320px;
  background: #ffffff;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
}

.card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}


.card-title {
  display: block;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
}

.card-subtitle {
  display: block;
  font-size: 0.875rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.text-sm{
  font-size: 0.875rem;
  color: #333;
  margin: 0.5rem 0;
  height: 150px;
  overflow-y: scroll;

}
.text-sm::-webkit-scrollbar {
  width: 0px;
}

.button_view{
  background:rgb(84, 41, 129);
  color: white;
  border:none !important;
  box-shadow: 0 2px 0px 3px rgb(29, 10, 48);
  transition: all 0.1s;
  &:hover{
    background: rgb(102, 51, 153) !important;
    color: white !important;
    transform: scale(1.02);
  }
}
</style>