import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cast-card',
  imports: [],
  templateUrl: './cast-card.html',
  styleUrl: './cast-card.scss',
})
export class CastCard {
  castName = input<string>();
  castRole = input<string>();
  castProfilePath = input<string | null>();
}
