
export class CharacterEntity {
    constructor({id = 0, name = "", createdAt = "", sourceUrl = "", imageUrl = "", films = [], tvShows = []}) {
        this.id = id;
        this.name = name;
        this.createdAt = new Date(createdAt);
        this.sourceUrl = sourceUrl;
        this.imageUrl = imageUrl;
        this.films = films;
        this.tvShows = tvShows;
    }
}