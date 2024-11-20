import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MusicService } from '../../services/music';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  name: string = ""
  constructor(private router: Router, private musicService: MusicService){}

  continue(){
    this.saveName();
    this.router.navigateByUrl('/home');
    this.startAudio();
  }

  saveName(){
    localStorage.setItem("name", this.name)
  }

  startAudio(){
    this.musicService.loadMusic();
    this.musicService.playMusic();
  }

  
}
