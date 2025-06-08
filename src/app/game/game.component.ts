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
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game!: Game;
  gameService!: GameService;
  gameId!: string;
  gameOver = false;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      const gameDoc = doc(this.firestore, `games/${this.gameId}`);
      docData(gameDoc).subscribe((game: any) => {
        this.game.currentPlayer = game.currentPlayer;
        this.game.players_images = game.players_images;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
        this.game.currentCard = game.currentCard;
        this.game.pickCardAnimation = game.pickCardAnimation;

        // console.log('Single game from Firestore:', game);
      });
    });
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else {
      if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop() || '';
        // console.log(this.currentCard);
        this.game.pickCardAnimation = true;

        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;

        this.updateGame();
        // console.log('New card: ' + this.currentCard);
        // console.log('Game is: ', this.game);
      }
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.updateGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.players_images.push('1.png');
        this.updateGame();
      }
    });
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    console.log('Edit', playerId);

    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players_images.splice(playerId, 1);
          this.game.players.splice(playerId, 1);
        } else {
          this.game.players_images[playerId] = change;
        }
        this.updateGame();
      }
    });
  }

  async updateGame() {
    const gameDoc = doc(this.firestore, `games/${this.gameId}`);
    await updateDoc(gameDoc, this.game.toJson());
  }
}
