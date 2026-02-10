import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
    private readonly songs = [];

    createNewSong() {
        this.songs.push()
        return this.songs;
    }
    findAll() {
        return this.songs;
    }
}
