import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from '../firebase-services/game.service';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
// import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

import {
  Firestore,
  collectionData,
  collection,
  doc,
  docData,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;
  gameService!: GameService;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      const gameDoc = doc(this.firestore, `games/${gameId}`);
      docData(gameDoc).subscribe((game: any) => {
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;

        // console.log('Single game from Firestore:', game);
      });
    });
  }

  newGame() {
    this.game = new Game();
    // const gamesCollection = collection(this.firestore, 'games');
    // addDoc(gamesCollection, this.game.toJson());
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() || '';
      console.log(this.currentCard);
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      // console.log('New card: ' + this.currentCard);
      // console.log('Game is: ', this.game);
    }
    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
