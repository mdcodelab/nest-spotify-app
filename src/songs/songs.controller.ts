import { Controller, Get, Post, Put, Delete } from "@nestjs/common";
import { SongsService } from "./songs.service";

@Controller("songs")
export class SongsController {
    constructor (
        private readonly songsService: SongsService) {}

@Get()
findAll() {
    return this.songsService.findAll();
    }

    @Put()
    createNewSong (){
        return this.songsService.createNewSong();
    }
}


