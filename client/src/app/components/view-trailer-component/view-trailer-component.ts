import { Component, inject, effect, input, signal } from '@angular/core';
import { MoviesService } from '../../services/movies-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-trailer-component',
  imports: [],
  templateUrl: './view-trailer-component.html',
  styleUrl: './view-trailer-component.scss',
})
export class ViewTrailerComponent {
  private readonly moviesService = inject(MoviesService);
  mediaType = input<'movie' | 'tv'>('movie');
  id = input<number>(-1);
  videoUrl = signal<string>('');
  private sanitizer = inject(DomSanitizer);

  trailerUrl = signal<SafeResourceUrl | null>(null);

  constructor() {
    effect(() => {
      const id = this.id();
      const type = this.mediaType();

      if (id === -1) return;

      this.moviesService.fetchTrailer(type, id).subscribe({
        next: (res) => {
          this.trailerUrl.set(
            this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${res?.key}`,
            ),
          );
          console.log(this.trailerUrl());
        },
      });
    });
  }
}
