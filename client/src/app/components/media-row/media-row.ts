import { Component, input } from '@angular/core';
import { MediaCard } from '../media-card/media-card';
import { TrendingMoviesType } from '../../models/movie-response.model';
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-media-row',
  imports: [MediaCard, CommonModule, LottieComponent],
  templateUrl: './media-row.html',
  styleUrl: './media-row.scss',
})
export class MediaRow {
  mediaType = input<string>();
  mediaList = input<TrendingMoviesType[]>();
  mediaLoading = input<boolean>();
  mediaHasError = input<boolean>();

  options: AnimationOptions = {
    path: '/404.json',
    loop: true,
    autoplay: true,
  };
}
