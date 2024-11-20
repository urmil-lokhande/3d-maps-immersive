/// <reference types="@types/google.maps" />
import { CommonModule } from '@angular/common';
import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA, Renderer2, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import "animate.css"
import { MusicService } from '../../services/music';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MapComponent implements OnInit, OnDestroy{
  @ViewChild('mapContainer') mapContainer: any;
  private timerInterval: any;
  elapsedTime: number = 0;
  map: any;
  isSidebarCollapsed: boolean = false
  currentlyOpen: boolean = true
  currentIndex: number = 0
  infoWindowOpen: boolean = false
  autocompleteResponseList: any[] = [];
  showSuggestions: boolean = false;
  query: string = ''
  currentlySolvedIndex: number = -1;
  markerRef: any[] = []
  gameCompleted: boolean = false
  title: string = ""
  name: string | null = ""
  explanation: string = ""
  leaderboardOpen: boolean = false
  isMusicPlaying: boolean = true
  isLocationInfoOpen: boolean = false
  infoWindowLine1: string = ""
  infoWindowLine2: string = ""
  riddles: any[] = [
    {
      "index": 0, 
      "riddleLine1": "In a harbor stands a lady so grand,",
      "riddleLine2": "A symbol of freedom, with a torch in hand.",
      "riddleLine3": "Gifted from friends across the sea,",
      "riddleLine4": "She welcomes all to the land of the free.",
      "answer": "The Statue of Liberty",
      "solved": false,
      "unlocked": true,
      "timeTaken": "",
      "place_id": ["ChIJPTacEpBQwokRKwIlDXelxkA"],
      "numberOfAttempts": 0,
      "hint": "A gift from France, this lady with a torch greets ships arriving in New York Harbor.",
      "tookHint": false,
      "infoWindow1": "RIGHT on!",
      "infoWindow2": "Did you know that the Crown has 7 Rays, which represent the seven continents and oceans of the world."
    },
    {
      "index": 1, 
      "riddleLine1": "A tower of iron, tall and grand,",
      "riddleLine2": "In the heart of Paris, it does stand.",
      "riddleLine3": "Lit at night with a golden hue,",
      "riddleLine4": "A symbol of France admired by all who view.",
      "answer": "Eiffel Tower",
      "solved": false,
      "unlocked": false,
      "timeTaken": "",
      "place_id": ["ChIJLU7jZClu5kcR4PcOOO6p3I0"],
      "numberOfAttempts": 0,
      "hint": "An iron lattice tower in Paris, built for the 1889 World's Fair, and a global icon of France.",
      "tookHint": false,
      "infoWindow1": "Bon Travail",
      "infoWindow2": `There’s a Champagne bar at the top.
        If you're brave enough to climb the stairs to the top of the tower, reward yourself with a glass of bubbly from the Champagne Bar. There's nothing like a bit of celebratory sparkle to accompany the spectacular views.
        To get to the top, you’ll have to climb 1,665 steps`
    }
  ,
    {
        "index": 2, 
        "riddleLine1": "To an ancient temple of red and gold,",
        "riddleLine2": "Where paper lanterns and legends are told.",
        "riddleLine3": "In a bustling district where prayers flow,",
        "riddleLine4": "You’ll find the next clue amid a gentle glow.",
        "answer": "Senso-ji Temple",
        "solved": false,
        "unlocked": false,
        "timeTaken": "",
        "place_id": ["ChIJ8T1GpMGOGGARDYGSgpooDWw"],
        "numberOfAttempts": 0,
        "hint": "Tokyo’s oldest temple, famous for its red gate, giant lantern, and Nakamise Street market.",
        "tookHint": false,
        "infoWindow1": "Yoku Yatta",
        "infoWindow2": "Coin tossing is a popular tradition at the Sensoji Temple. Carry a 5 yen coin symbolizes good luck in Japan!"
    },
    {
        "index": 3, 
        "riddleLine1": "A royal home, both grand and old,",
        "riddleLine2": "With guards in red, so proud and bold.",
        "riddleLine3": "Its gates have seen processions and cheers,",
        "riddleLine4": "Find your clue where history appears.",
        "answer": "Buckingham Palace",
        "solved": false,
        "unlocked": false,
        "timeTaken": "",
        "place_id": ["ChIJtV5bzSAFdkgRpwLZFPWrJgo"],
        "numberOfAttempts": 0,
        "hint": "This iconic residence is known for the Changing of the Guard, a grand spectacle outside its gates. It’s home to British monarchs and a symbol of London’s regal heritage.",
        "tookHint": false,
        "infoWindow1": "Top Notch! Aced it!!",
        "infoWindow2": "Over 50,000 guests are invited to the palace each year, do you fancy being one of them?"
    },
    {
        "index": 4, 
        "riddleLine1": "In a city of art and fountains grand,",
        "riddleLine2": "Throw a coin with your left hand.",
        "riddleLine3": "Legend says you’re bound to return,",
        "riddleLine4": "To where the waters flow and statues turn.",
        "answer": "The Trevi Fountain",
        "solved": false,
        "unlocked": false,
        "timeTaken": "",
        "place_id": ["ChIJ1UCDJ1NgLxMRtrsCzOHxdvY"],
        "numberOfAttempts": 0,
        "hint": "A Baroque masterpiece in Rome where throwing a coin ensures your return to the Eternal City.",
        "tookHint": false,
        "infoWindow1": "Bravo!!",
        "infoWindow2": "Every second, the fountain pumps out around 170 litres of water! Don't Worry, The water isn’t wasted as it is constantly being recycled! All of the money thrown into the fountain goes to charity"
    },
    {
        "index": 5, 
        "riddleLine1": "Where a bridge arches over sparkling blue,",
        "riddleLine2": "And fireworks light the first of the New.",
        "riddleLine3": "It stands near sails of ivory white,",
        "riddleLine4": "A gateway and symbol in the golden light.",
        "answer": "Sydney Harbour Bridge",
        "solved": false,
        "unlocked": false,
        "timeTaken": "",
        "place_id": ["ChIJ49XqJV2uEmsRPsTAF7eOlGg","Ei9TeWRuZXkgSGFyYm91ciBCcmlkZ2UsIFRoZSBSb2NrcyBOU1csIEF1c3RyYWxpYSIuKiwKFAoSCQWuyBWLrhJrEZ-11J32HAwvEhQKEgmzj122Qq4SaxFgzTIWaH0BBQ"],
        "numberOfAttempts": 0,
        "hint": "An iconic bridge in Australia, connecting the Sydney Opera House and the city skyline, often nicknamed 'The Coathanger.'",
        "tookHint": false,
        "infoWindow1": "Good on Ya!",
        "infoWindow2": "Welcome to the world's heaviest steel arch bridge Nicknamed 'the Coathanger' because of its arched design,"
    }
  ];
  
  constructor(private renderer: Renderer2, private musicService: MusicService){}

  ngOnInit() {
    this.loadMap();
    this.startTimer();
    this.name = localStorage.getItem("name");
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
    }, 1000);
  }

  get formattedTime(): string {
    const minutes: string = String(Math.floor(this.elapsedTime / 60)).padStart(2, '0');
    const seconds: string = String(this.elapsedTime % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  stopTimer(): void {
    clearInterval(this.timerInterval);
  }

  async loadMap() {
    //@ts-ignore
    const { Map3DElement } = await google.maps.importLibrary("maps3d");

    const map = new Map3DElement({
      center: { lat: 46.232562147959406,  lng: 24.59387890539589, altitude: 20000000 },
      tilt: 2,
      range: 5000
    });

    this.map = map;
    this.renderer.appendChild(this.mapContainer.nativeElement, this.map)
  }

  toggleSidebar(){
    this.isSidebarCollapsed = !this.isSidebarCollapsed
  }

  openRiddle(index: number){
    if(!this.riddles[index].unlocked){
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Relic locked!",
        position: "bottom-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        background: "#EDC2A3",
      })
      return
    }

    if(this.currentIndex == index){
      this.currentlyOpen = !this.currentlyOpen
    }else{
      this.currentIndex = index
      this.currentlyOpen = true
    }

    
  }

  toggleInfoWindow(){
    this.infoWindowOpen = !this.infoWindowOpen
  }

  displaySuggestions(
    predictions: google.maps.places.QueryAutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus,
    autocompletePredictions: any[]
  ) {
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      console.debug(status);
      return;
    }

    while (autocompletePredictions.length > 0) {
      autocompletePredictions.pop()
    }

    for (let prediction of predictions) {
      autocompletePredictions.push(prediction)
    }
  };

  changeHandler = async(event: any) => {
    this.query = event.target.value;
    if (event.target.value === '') {
      this.showSuggestions = false;
    }

    if(event.target.value.length > 0){
      this.showSuggestions = true;
      //@ts-ignore
      const { AutocompleteService } = await google.maps.importLibrary("places")
      let service = new AutocompleteService()
      service.getPlacePredictions({ input: this.query }, (predictions: any, status: any) => this.displaySuggestions(predictions, status, this.autocompleteResponseList));
    }
  }

  geocode = async (suggestion: any) => {
    this.showSuggestions = false;
    this.query = suggestion.description;
    //@ts-ignore
    let { Geocoder } = await google.maps.importLibrary("geocoding");
    //@ts-ignore
    let { Marker3DElement } = await google.maps.importLibrary("maps3d");

    let geocoder = new Geocoder();
    let that = this;
    this.clearMarkers();
    this.closeLocationInfoWindow();
    geocoder.geocode({ placeId: suggestion.place_id }, function(geocoderResult: any, geocoderStatus: any) {
        let lat = geocoderResult[0].geometry.location.lat();
        let lng = geocoderResult[0].geometry.location.lng();
        let location = {lat, lng};
        that.flyCameraTo(location);

        let marker = new Marker3DElement({
          position: {lat, lng, altitude: 100},
          altitudeMode: 'RELATIVE_TO_GROUND',
          extruded: true,
        })

        that.markerRef.push(marker)
        that.map.append(marker)
    })

    let riddle = this.riddles[this.currentlySolvedIndex + 1];
    if(riddle){
      let placeIDs = riddle.place_id;

    if(placeIDs.includes(suggestion.place_id)){
      this.celebrate();
      setTimeout(()=>{
        if(!this.riddles[5].solved){
          this.showLocationInfoWindow(this.currentIndex-1)
        }
      }, 10000)
      this.currentIndex = this.currentlySolvedIndex + 1;
      this.currentlyOpen = true;
      this.currentlySolvedIndex = this.currentlySolvedIndex + 1;
      riddle.solved = true;
      
      if(this.riddles[5].solved){
        this.stopTimer();
        setTimeout( () => {
          this.gameCompleted = true;
          this.title = this.getTitle(this.elapsedTime).title
          this.explanation = this.getTitle(this.elapsedTime).explanation
          this.leaderboardOpen = true
        }, 12000)
      }
      if(this.currentlySolvedIndex + 1 < 6){
        this.riddles[this.currentlySolvedIndex+1].unlocked = true;
        this.openRiddle(this.currentlySolvedIndex+1);
      }
      
    }else{
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Incorrect Destination. Try Again!",
        position: "bottom-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        background: "#EDC2A3",
      })
      this.riddles[this.currentIndex]['numberOfAttempts'] = this.riddles[this.currentIndex]['numberOfAttempts'] + 1;
    }
    }
    
  }

  flyCameraTo(location: any){
    const camera = {
      center: { lat: location.lat, lng: location.lng, altitude: 10 },
      tilt: 67.5,
      range: 1000
    }

    this.map.flyCameraTo({
      endCamera: camera,
      durationMillis: 10000
    });

    setTimeout(()=>{
      this.map.flyCameraAround({
        camera: camera,
        durationMillis: 100000,
        rounds: 1
      });
    }, 10000)
  }

  clearMarkers(){
    for(let marker of this.markerRef){
      marker.position = null
    }
  }

  celebrate(){
    const duration = 3000;
    confetti({
      particleCount: 2000,
      spread: 1000,
      origin: { y: 0.6 },
    });
    setTimeout(() => confetti.reset(), duration);
  }

  openHint(index: number){
    if(this.riddles[index].unlocked && !this.riddles[index].solved){
      this.riddles[index].tookHint = true
      this.currentlyOpen = !this.currentlyOpen
      this.elapsedTime += 60
    }
  }

  clearText(){
    this.query = ""
    this.showSuggestions = false
  }

  getTitle(time: number){
    if(time < 180){
      return {
        title: "The Legendary Pathfinder", 
        explanation: `Blazing through the trails with unmatched wit and speed, you’ve etched your name in the annals of treasure-hunting greatness. The cartographer himself would be in awe of your skills. Congratulations on claiming the title of Legendary Pathfinder!`
      }
    }else if(time >= 180 && time < 360){
      return {
        title: "The Master Navigator", 
        explanation: `With precision and insight, you’ve unraveled the mysteries of the map and claimed the treasures of the ages. Your mastery over the riddles earns you the prestigious title of Master Navigator. Outstanding work!`
      }
    }else if(time >= 360 && time < 540){
      return {
        title: "The Skilled Explorer", 
        explanation: `Your determination and resourcefulness have led you to uncover the cartographer’s hidden treasures. Though the journey was challenging, you proved yourself a Skilled Explorer. Well done on your adventure!`
      }
    }else {
      return {
        title: "The Determined Adventurer", 
        explanation: `You refused to give up, braving every riddle and obstacle with tenacity. Your perseverance is a testament to true adventurer spirit. Congratulations on earning the title of Determined Adventurer!`
      }
    }
  }

  closeLeaderboard(){
    this.leaderboardOpen = false
  }

  handleMusic(){
    if(this.isMusicPlaying){
      this.isMusicPlaying = !this.isMusicPlaying
      this.musicService.pauseMusic();
    }else{
      this.isMusicPlaying = !this.isMusicPlaying
      this.musicService.playMusic();
    }
  }

  refresh(){
    this.currentIndex = 0;
    this.loadMap();
    this.musicService.playMusic();
    
    this.elapsedTime = 0;
    this.clearMarkers();
    this.gameCompleted = false;
    this.riddles = [
      {
        "index": 0, 
        "riddleLine1": "In a harbor stands a lady so grand,",
        "riddleLine2": "A symbol of freedom, with a torch in hand.",
        "riddleLine3": "Gifted from friends across the sea,",
        "riddleLine4": "She welcomes all to the land of the free.",
        "answer": "The Statue of Liberty",
        "solved": false,
        "unlocked": true,
        "timeTaken": "",
        "place_id": ["ChIJPTacEpBQwokRKwIlDXelxkA"],
        "numberOfAttempts": 0,
        "hint": "A gift from France, this lady with a torch greets ships arriving in New York Harbor.",
        "tookHint": false,
        "infoWindow1": "RIGHT on!",
        "infoWindow2": "Did you know that the Crown has 7 Rays, which represent the seven continents and oceans of the world."
      },
      {
        "index": 1, 
        "riddleLine1": "A tower of iron, tall and grand,",
        "riddleLine2": "In the heart of Paris, it does stand.",
        "riddleLine3": "Lit at night with a golden hue,",
        "riddleLine4": "A symbol of France admired by all who view.",
        "answer": "Eiffel Tower",
        "solved": false,
        "unlocked": false,
        "timeTaken": "",
        "place_id": ["ChIJLU7jZClu5kcR4PcOOO6p3I0"],
        "numberOfAttempts": 0,
        "hint": "An iron lattice tower in Paris, built for the 1889 World's Fair, and a global icon of France.",
        "tookHint": false,
        "infoWindow1": "Bon Travail",
        "infoWindow2": `There’s a Champagne bar at the top.
          If you're brave enough to climb the stairs to the top of the tower, reward yourself with a glass of bubbly from the Champagne Bar. There's nothing like a bit of celebratory sparkle to accompany the spectacular views.
          To get to the top, you’ll have to climb 1,665 steps`
      }
    ,
      {
          "index": 2, 
          "riddleLine1": "To an ancient temple of red and gold,",
          "riddleLine2": "Where paper lanterns and legends are told.",
          "riddleLine3": "In a bustling district where prayers flow,",
          "riddleLine4": "You’ll find the next clue amid a gentle glow.",
          "answer": "Senso-ji Temple",
          "solved": false,
          "unlocked": false,
          "timeTaken": "",
          "place_id": ["ChIJ8T1GpMGOGGARDYGSgpooDWw"],
          "numberOfAttempts": 0,
          "hint": "Tokyo’s oldest temple, famous for its red gate, giant lantern, and Nakamise Street market.",
          "tookHint": false,
          "infoWindow1": "Yoku Yatta",
          "infoWindow2": "Coin tossing is a popular tradition at the Sensoji Temple. Carry a 5 yen coin symbolizes good luck in Japan!"
      },
      {
          "index": 3, 
          "riddleLine1": "A royal home, both grand and old,",
          "riddleLine2": "With guards in red, so proud and bold.",
          "riddleLine3": "Its gates have seen processions and cheers,",
          "riddleLine4": "Find your clue where history appears.",
          "answer": "Buckingham Palace",
          "solved": false,
          "unlocked": false,
          "timeTaken": "",
          "place_id": ["ChIJtV5bzSAFdkgRpwLZFPWrJgo"],
          "numberOfAttempts": 0,
          "hint": "This iconic residence is known for the Changing of the Guard, a grand spectacle outside its gates. It’s home to British monarchs and a symbol of London’s regal heritage.",
          "tookHint": false,
          "infoWindow1": "Top Notch! Aced it!!",
          "infoWindow2": "Over 50,000 guests are invited to the palace each year, do you fancy being one of them?"
      },
      {
          "index": 4, 
          "riddleLine1": "In a city of art and fountains grand,",
          "riddleLine2": "Throw a coin with your left hand.",
          "riddleLine3": "Legend says you’re bound to return,",
          "riddleLine4": "To where the waters flow and statues turn.",
          "answer": "The Trevi Fountain",
          "solved": false,
          "unlocked": false,
          "timeTaken": "",
          "place_id": ["ChIJ1UCDJ1NgLxMRtrsCzOHxdvY"],
          "numberOfAttempts": 0,
          "hint": "A Baroque masterpiece in Rome where throwing a coin ensures your return to the Eternal City.",
          "tookHint": false,
          "infoWindow1": "Bravo!!",
          "infoWindow2": "Every second, the fountain pumps out around 170 litres of water! Don't Worry, The water isn’t wasted as it is constantly being recycled! All of the money thrown into the fountain goes to charity"
      },
      {
          "index": 5, 
          "riddleLine1": "Where a bridge arches over sparkling blue,",
          "riddleLine2": "And fireworks light the first of the New.",
          "riddleLine3": "It stands near sails of ivory white,",
          "riddleLine4": "A gateway and symbol in the golden light.",
          "answer": "Sydney Harbour Bridge",
          "solved": false,
          "unlocked": false,
          "timeTaken": "",
          "place_id": ["ChIJ49XqJV2uEmsRPsTAF7eOlGg","Ei9TeWRuZXkgSGFyYm91ciBCcmlkZ2UsIFRoZSBSb2NrcyBOU1csIEF1c3RyYWxpYSIuKiwKFAoSCQWuyBWLrhJrEZ-11J32HAwvEhQKEgmzj122Qq4SaxFgzTIWaH0BBQ"],
          "numberOfAttempts": 0,
          "hint": "An iconic bridge in Australia, connecting the Sydney Opera House and the city skyline, often nicknamed 'The Coathanger.'",
          "tookHint": false,
          "infoWindow1": "Good on Ya!",
          "infoWindow2": "Welcome to the world's heaviest steel arch bridge Nicknamed 'the Coathanger' because of its arched design,"
      }
    ];

    this.name = localStorage.getItem("name");
    this.map.flyCameraTo({
      endCamera: {
        center: { lat: 46.232562147959406,  lng: 24.59387890539589, altitude: 20000000 },
        tilt: 2,
        range: 5000
      },
      durationMillis: 10000
    })

    setTimeout(()=>{
      this.startTimer();
    }, 10000)
  }

  showLocationInfoWindow(index: number){
    this.isLocationInfoOpen = true
    this.infoWindowLine1 = this.riddles[index].infoWindow1
    this.infoWindowLine2 = this.riddles[index].infoWindow2
  }

  closeLocationInfoWindow(){
    this.isLocationInfoOpen = false
  }

}
