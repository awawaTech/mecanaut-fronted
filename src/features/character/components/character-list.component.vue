<script>

import CharacterItem from "./character-item.component.vue";
import {CharacterEntity} from "../models/character.entity.js";

export default {
  name: "character-list",
  components: {CharacterItem},
  props: {
    characters: {
      type: Array[CharacterEntity],
      required: true
    }
  }
}
</script>

<template>
  <div class="p-m-4">
    <h3 class="subtitle" aria-checked="true">
      {{ $t('main.title')}}
    </h3>
    <div class="flex flex-wrap gap-6 justify-content-center">
      <character-item
          v-for="character in characters"
          :key="character.id"
          :character="character"
      />
    </div>
  </div>
</template>


<style scoped>
.subtitle {
  justify-content: center;
  text-align: center;
  font-size: 2.2em;
  font-weight: 700;
  color: rgb(84, 41, 129);
}
</style>