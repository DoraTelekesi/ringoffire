import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { Game } from 'src/models/game';
import { addDoc, collection } from 'firebase/firestore';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  constructor(private firestore: Firestore, private router: Router) {}

  async newGame() {
    let game = new Game();
    const gamesCollection = collection(this.firestore, 'games');

    const gameDocRef = await addDoc(gamesCollection, game.toJson());

    this.router.navigateByUrl('/game/' + gameDocRef.id);

    //Start game
  }
}
