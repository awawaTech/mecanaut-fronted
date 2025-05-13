<script>
import { CharacterEntity } from "../models/character.entity.js";

export default {
  name: "character-form",
  props: {
    character: { 
      type: Object,
      default: () => new CharacterEntity({}) 
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: "",
        imageUrl: "",
        sourceUrl: "",
        films: [],
        tvShows: []
      },
      newFilm: "",
      newShow: "",
      submitted: false,
      errors: {
        name: false
      }
    };
  },
  mounted() {
    this.initForm();
  },
  methods: {
    initForm() {
      this.form = {
        name: this.character.name || "",
        imageUrl: this.character.imageUrl || "",
        sourceUrl: this.character.sourceUrl || "",
        films: Array.isArray(this.character.films) ? [...this.character.films] : [],
        tvShows: Array.isArray(this.character.tvShows) ? [...this.character.tvShows] : []
      };
    },
    addFilm() {
      if (this.newFilm.trim()) {
        this.form.films.push(this.newFilm.trim());
        this.newFilm = "";
      }
    },
    removeFilm(index) {
      this.form.films.splice(index, 1);
    },
    addShow() {
      if (this.newShow.trim()) {
        this.form.tvShows.push(this.newShow.trim());
        this.newShow = "";
      }
    },
    removeShow(index) {
      this.form.tvShows.splice(index, 1);
    },
    validate() {
      this.errors.name = !this.form.name.trim();
      return !this.errors.name;
    },
    submitForm() {
      this.submitted = true;
      
      if (!this.validate()) {
        return false;
      }
      
      const characterData = new CharacterEntity({
        id: this.character.id || 0,
        name: this.form.name,
        imageUrl: this.form.imageUrl,
        sourceUrl: this.form.sourceUrl,
        films: this.form.films,
        tvShows: this.form.tvShows,
        createdAt: (this.character.createdAt instanceof Date && !isNaN(this.character.createdAt)) 
            ? this.character.createdAt 
            : new Date()
      });
      
      console.log("Datos enviados desde el formulario:", characterData);
      this.$emit('submit', characterData);
      return true;
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<template>
  <div class="character-form">
    <form @submit.prevent="submitForm">
      <!-- Nombre -->
      <div class="form-group">
        <label for="name" class="form-label">Nombre *</label>
        <input 
          id="name" 
          v-model="form.name" 
          type="text"
          class="form-control" 
          :class="{ 'is-invalid': submitted && errors.name }"
          aria-required="true"
          placeholder="Nombre del personaje"
        />
        <div v-if="submitted && errors.name" class="invalid-feedback">
          El nombre es obligatorio
        </div>
      </div>
      
      <!-- URL de imagen -->
      <div class="form-group">
        <label for="imageUrl" class="form-label">URL de Imagen</label>
        <input 
          id="imageUrl" 
          v-model="form.imageUrl" 
          type="text"
          class="form-control"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        <div class="form-text">
          URL de la imagen del personaje (opcional)
        </div>
      </div>
      
      <!-- URL fuente -->
      <div class="form-group">
        <label for="sourceUrl" class="form-label">URL de Fuente</label>
        <input 
          id="sourceUrl" 
          v-model="form.sourceUrl" 
          type="text"
          class="form-control"
          placeholder="https://ejemplo.com/pagina-del-personaje"
        />
        <div class="form-text">
          URL de la página oficial o wiki del personaje (opcional)
        </div>
      </div>
      
      <!-- Películas -->
      <div class="form-group">
        <label class="form-label">Películas</label>
        <div class="input-group">
          <input 
            v-model="newFilm" 
            type="text"
            class="form-control"
            placeholder="Nombre de la película"
            @keyup.enter="addFilm"
          />
          <button 
            type="button" 
            class="btn btn-primary"
            @click="addFilm"
          >
            Añadir
          </button>
        </div>
        
        <div class="items-list">
          <div v-for="(film, index) in form.films" :key="`film-${index}`" class="item">
            <span>{{ film }}</span>
            <button 
              type="button" 
              class="btn-remove"
              @click="removeFilm(index)"
              aria-label="Eliminar película"
            >
              ✕
            </button>
          </div>
          <div v-if="form.films.length === 0" class="no-items">
            No hay películas añadidas
          </div>
        </div>
      </div>
      
      <!-- Series de TV -->
      <div class="form-group">
        <label class="form-label">Series de TV</label>
        <div class="input-group">
          <input 
            v-model="newShow" 
            type="text"
            class="form-control"
            placeholder="Nombre de la serie"
            @keyup.enter="addShow"
          />
          <button 
            type="button" 
            class="btn btn-primary"
            @click="addShow"
          >
            Añadir
          </button>
        </div>
        
        <div class="items-list">
          <div v-for="(show, index) in form.tvShows" :key="`show-${index}`" class="item">
            <span>{{ show }}</span>
            <button 
              type="button" 
              class="btn-remove"
              @click="removeShow(index)"
              aria-label="Eliminar serie"
            >
              ✕
            </button>
          </div>
          <div v-if="form.tvShows.length === 0" class="no-items">
            No hay series añadidas
          </div>
        </div>
      </div>
      
      <!-- Botones -->
      <div class="form-buttons">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="cancel"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
        >
          {{ isEdit ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.character-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out;
}

.form-control:focus {
  border-color: rgb(84, 41, 129);
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(84, 41, 129, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545;
}

.form-text {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.input-group {
  display: flex;
  margin-bottom: 0.5rem;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  cursor: pointer;
}

.btn-primary {
  color: #fff;
  background-color: rgb(84, 41, 129);
  border-color: rgb(84, 41, 129);
}

.btn-primary:hover {
  background-color: rgb(102, 51, 153);
  border-color: rgb(102, 51, 153);
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.items-list {
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.btn-remove {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.5rem;
}

.no-items {
  padding: 1rem;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
