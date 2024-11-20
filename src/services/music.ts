import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MusicService {
  audio: any
  constructor() {}

  loadMusic(){
    this.audio = new Audio('assets/music.mp3')
  }

  playMusic(){
    this.audio.play()
  }

  pauseMusic(){
    this.audio.pause()
  }
}