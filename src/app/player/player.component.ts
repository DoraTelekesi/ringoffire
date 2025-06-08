import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() name: string = '';
  @Input() image: string = '1.png';
  @Input() playerActive: boolean = false;
  constructor() {}
  ngOnInit(): void {}
}
