import { Component, inject, input, signal } from '@angular/core';
import { TrendingMediaType } from '../../models/movie-response.model';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-media-card',
  imports: [DatePipe, RouterModule],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
})
export class MediaCard {
  item = input<TrendingMediaType>();
  private readonly _router = inject(Router);

  openDetails() {
    this._router.navigate(['/', this.item()?.media_type, this.item()?.id]);
  }
}
