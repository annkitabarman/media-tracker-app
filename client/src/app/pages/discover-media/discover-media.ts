import {
  Component,
  inject,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';
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
  private readonly _discoverMediaService = inject(DiscoverMediaService);
  category = signal<string>('');
  type = signal<string>('');
  isLoading = signal<boolean>(false);

  media$ = this._discoverMediaService.media$;

  allMedia = signal<TrendingMediaType[]>([]);
  skeletonCards = Array.from({ length: 20 });

  get hasMoreMedia(): boolean {
    return this._discoverMediaService.hasMore(this.type(), this.category());
  }

  urlMap: Record<string, string> = {
    popular: 'Popular',
    top_rated: 'Top Rated',
    upcoming: 'Upcoming',
    airing_today: 'Airing Today',
  };

  get heading(): string {
    return this.urlMap[this.category()] ?? '';
  }
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this._activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((params) => {
        const param = params;
        this.category.set(params.get('category') ?? '');
        this.type.set(params.get('type') ?? '');
        this.allMedia.set([]);
        this.fetchDiscovery();
      });
  }

  @ViewChild('loadMoreTrigger')
  loadMoreTrigger!: ElementRef;

  private observer!: IntersectionObserver;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          this.hasMoreMedia &&
          !this.isLoading()
        ) {
          this.fetchDiscovery();
        }
      },
      {
        threshold: 0.1,
      },
    );

    this.observer.observe(this.loadMoreTrigger.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  fetchDiscovery() {
    if (this.isLoading() || !this.hasMoreMedia) {
      return;
    }

    this.isLoading.set(true);

    this._discoverMediaService
      .fetchDiscoveryMedia(this.type(), this.category())
      .subscribe({
        next: (res) => {
          this.allMedia.update((items) => [...items, ...res.results]);

          this.isLoading.set(false);
        },

        error: (err) => {
          console.error('Error loading media', err);
          this.isLoading.set(false);
        },
      });
  }

  applyFilters(e: {
    sort: string | null;
    genres: number[] | null;
    from_date: string | null;
    to_date: string | null;
  }) {
    this._discoverMediaService.fetchFilteredMedia(this.type(), e).subscribe({
      next: (res) => {
        this.allMedia.set(res.results);
      },
    });
  }
}
