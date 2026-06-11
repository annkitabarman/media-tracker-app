import { Component, inject, OnInit, signal } from '@angular/core';
import { DiscoverFilter } from '../../components/discover-filter/discover-filter';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { DiscoverMediaService } from '../../services/discover-media-service';
import { TrendingMediaType } from '../../models/movie-response.model';
import { MediaCard } from '../../components/media-card/media-card';

@Component({
  selector: 'app-discover-media',
  imports: [DiscoverFilter, MediaCard],
  templateUrl: './discover-media.html',
  styleUrl: './discover-media.scss',
})
export class DiscoverMedia implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _discoverMedia = inject(DiscoverMediaService);
  category = signal<string>('');
  type = signal<string>('');

  media$ = this._discoverMedia.media$;

  allMedia = signal<TrendingMediaType[]>([]);

  urlMap: Record<string, string> = {
    popular: 'Popular',
    top_rated: 'Top Rated',
    upcoming: 'Upcoming',
    airing_today: 'Airing Today',
  };

  get heading(): string {
    return this.urlMap[this.category()] ?? '';
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((params) => {
        const param = params;
        this.category.set(params.get('category') ?? '');
        this.type.set(params.get('type') ?? '');
        this.fetchDiscovery();
      });
  }

  fetchDiscovery() {
    this._discoverMedia
      .fetchDiscoveryMedia(this.type(), this.category())
      .subscribe({
        next: (res) => {
          this.allMedia.set(res.results);
          console.log(res.results);
        },
      });
  }
}
