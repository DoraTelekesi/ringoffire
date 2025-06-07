import { Component } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ringoffire';
    testData$: Observable<any[]>;

  constructor(private firestore: Firestore) {
    const coll = collection(this.firestore, 'test');
    this.testData$ = collectionData(coll);
    this.testData$.subscribe(data => {
      console.log('Firestore data:', data);
    });
  }
}
