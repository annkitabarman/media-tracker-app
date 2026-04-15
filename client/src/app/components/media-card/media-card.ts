import { Component, input, signal } from '@angular/core';
import { TrendingMediaType } from '../../models/movie-response.model';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-media-card',
  imports: [DatePipe, RouterModule],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
})
export class MediaCard {
  item = input<TrendingMediaType>();

  isHovered = signal<boolean>(false);
  private _hoverTimeout: any;

  onMouseEnter() {
    this._hoverTimeout = setTimeout(() => {
      this.isHovered.set(true);
    }, 1000);
  }

  onMouseLeave() {
    clearTimeout(this._hoverTimeout);
    this.isHovered.set(false);
  }
}
