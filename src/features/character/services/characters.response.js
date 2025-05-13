
export class CharacterResource {
    constructor({
                    _id        = 0,
                    films       = [],
                    shortFilms      = [],
                    tvShows    = [],
                    videoGames    = [],
                    parkAttractions= [],
                    allies   = [],
                    enemies   = [],
                    sourceUrl  = "",
                    name   = "",
                    imageUrl    = "",
                    createdAt     = "",
                    updatedAt   = "",
                    url    = ""
                } = {}) {
        this._id = _id ? _id : null;
        this.films = films ? films : null;
        this.shortFilms = shortFilms ? shortFilms : null;
        this.tvShows = tvShows ? tvShows : null;
        this.videoGames = videoGames ? videoGames : null;
        this.parkAttractions = parkAttractions ? parkAttractions : null;
        this.allies   = allies ? allies : null;
        this.enemies = enemies ? enemies : null;
        this.sourceUrl = sourceUrl ? sourceUrl : null;
        this.name   = name ? name : null;
        this.imageUrl = imageUrl ? imageUrl : null;
        this.createdAt = createdAt ? new Date(createdAt)  : null;
        this.updatedAt = updatedAt ? new Date(updatedAt)  : null;
        this.url    = url ? url : null;

    }

}

export class CharacterResponse {
    constructor({
                    info = {
                        count: 0,
                        totalPages: 0,
                        previousPage: null,
                        nextPage: null
                    },
                    data = []
                } = {}) {
        this.info = {
            count: info.count || 0,
            totalPages: info.totalPages || 0,
            previousPage: info.previousPage || null,
            nextPage: info.nextPage || null
        };

        this.data = Array.isArray(data)
            ? data.map(character => new CharacterResource(character))
            : [];
    }
}
