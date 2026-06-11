import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies-service';
import {
  MediaDetailsResponse,
  KeyWordsResponse,
} from '../../models/movie-response.model';
import { DatePipe } from '@angular/common';
import { MinutesToHoursPipe } from '../../pipes/minutes-to-hours-pipe';
import { CastDetailsResponse } from '../../models/cast-response.model';
import { CastService } from '../../services/cast-service';
import { CastCard } from '../../components/cast-card/cast-card';
import { SharedService } from '../../services/shared-service';
import { CurrencyPipe } from '@angular/common';
import {
  takeUntilDestroyed,
  toSignal,
  toObservable,
} from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectCurrentWatchlistItem } from '../../store/watchlist/watchlist.selectors';
import { switchMap, of } from 'rxjs';
import {
  removeFromWatchlist,
  addToWatchlist,
} from '../../store/watchlist/watchlist.actions';

@Component({
  selector: 'app-media-details',
  imports: [DatePipe, MinutesToHoursPipe, CastCard, CurrencyPipe],
  templateUrl: './media-details.html',
  styleUrl: './media-details.scss',
})
export class MediaDetails implements OnInit {
  private readonly _activateRoute = inject(ActivatedRoute);
  private readonly _moviesService = inject(MoviesService);
  private readonly _castService = inject(CastService);
  private readonly _sharedService = inject(SharedService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _store = inject(Store);
  id = signal<number>(0);
  type = signal<'movie' | 'tv'>('movie');
  genreList = signal<string[] | undefined>([]);
  mediaData = signal<MediaDetailsResponse | null>(null);
  isDropdownOpen = signal<boolean>(false);
  radius = signal<number>(25);
  originalLang = signal<string>('English');
  keywordsList = signal<KeyWordsResponse['keywords']>([]);
  showToast = signal<boolean>(false);
  loading = signal<boolean>(false);
  watched = signal<boolean>(false);

  toggleWatched() {
    this.watched.set(!this.watched());
  }

  get isMovie(): boolean {
    const data = this.mediaData();
    return data?.mediaType === 'movie';
  }

  get displayTitle() {
    const data = this.mediaData();
    if (!data) return '';

    return data.mediaType === 'movie' ? data.title : data.name;
  }

  get releaseDate() {
    const data = this.mediaData();
    if (!data) return;

    return data.mediaType === 'movie' ? data.release_date : data.first_air_date;
  }

  get seasonCount(): number {
    const data = this.mediaData();
    if (!data || data.mediaType !== 'tv') return 0;

    const today = new Date();

    const seasons = (data.seasons ?? [])
      .filter((s) => s.season_number !== 0)
      .filter((s) => s.air_date && new Date(s.air_date) <= today);

    return seasons.length;
  }

  get budget(): number | null {
    const data = this.mediaData();
    if (!data || data.mediaType !== 'movie') return null;

    return data.budget;
  }

  get revenue(): number | null {
    const data = this.mediaData();
    if (!data || data.mediaType !== 'movie') return null;

    return data.revenue;
  }

  get runtime(): number | null {
    const data = this.mediaData();
    if (!data || data.mediaType !== 'movie') return null;

    return data.runtime;
  }

  get typeOfShow(): string | null {
    const data = this.mediaData();
    if (!data || data.mediaType !== 'tv') return null;

    return data.type;
  }

  castList = computed(() => {
    return (this.castDetails()?.cast ?? []).slice(0, 9);
  });

  existingWatchlist = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        id ? this._store.select(selectCurrentWatchlistItem(id)) : of(null),
      ),
    ),
    { initialValue: null },
  );

  removeFromWatchlist() {
    this._store.dispatch(removeFromWatchlist({ id: this.id() }));
  }

  addToWatchlist() {
    const data = this.mediaData();
    if (!data) return;
    this.loading.set(true);
    if (!this.isAddedToWatchlist()) {
      const payload = {
        name: data.mediaType === 'movie' ? data.title : data.name,
        year:
          data?.mediaType === 'movie'
            ? data?.release_date
            : data?.first_air_date,
        poster: data?.poster_path ?? '',
        mediaType: this.type(),
        id: this.id(),
        overview: data.overview,
        original_lang: data.original_language,
        vote_average: data.vote_average,
        genre: this.genreList() ?? [],
        dateAdded: new Date().toISOString(),
      };
      this._store.dispatch(addToWatchlist({ item: payload }));
    } else {
      this.removeFromWatchlist();
    }

    setTimeout(() => {
      this.loading.set(false);
    }, 200);
  }

  isAddedToWatchlist = computed(() => !!this.existingWatchlist());

  castDetails = signal<CastDetailsResponse | null>(null);

  circumference = computed(() => {
    return 2 * Math.PI * this.radius();
  });

  dashOffset = computed(() => {
    return (
      this.circumference() * (1 - (this.mediaData()?.vote_average ?? 0) / 10)
    );
  });

  showSuccessToast() {
    this.showToast.set(true);

    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }

  get percentage() {
    return Math.round((this.mediaData()?.vote_average ?? 0) * 10);
  }

  ngOnInit(): void {
    this.fetchRoutes();
    this.generateLanguageList();
  }

  generateLanguageList() {
    this._sharedService.fetchLanguageMapping().subscribe({
      next: (mapping) => {
        const originalLang = this.mediaData()?.original_language;
        if (originalLang && mapping[originalLang]) {
          this.originalLang.set(mapping[originalLang]);
        }
      },

      error: (err) => {
        console.error('Failed to fetch language mapping', err);
      },
    });
  }

  generateGenreList() {
    const genres = this.mediaData()?.genres.map((genre) => {
      return genre.name;
    });
    this.genreList.set(genres ?? []);
  }

  fetchKeywords() {
    if (!this.id() || !this.type()) return;

    this._moviesService.fetchKeywords(this.id(), this.type()).subscribe({
      next: (res) => {
        this.keywordsList.set(res.keywords);
      },
      error: (err) => {
        console.error('Failed to fetch keywords', err);
      },
    });
  }

  fetchRoutes() {
    this._activateRoute.paramMap
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((params) => {
        const id = Number(params.get('id'));
        this.id.set(id);
        const type = params.get('type');
        if (type === 'movie' || type === 'tv') {
          this.type.set(type);
        } else {
          this.type.set('movie');
        }
        this.fetchMediaData();
        this.fetchCastDetails();
        this.fetchKeywords();
      });
  }

  fetchMediaData() {
    this._moviesService.fetchMediaDetails(this.id(), this.type()).subscribe({
      next: (res) => {
        this.mediaData.set(res);
        this.generateGenreList();
        console.log(res);
      },
      error: (err) => {
        console.error('Something went wrong!!', err);
      },
    });
  }

  fetchCastDetails() {
    if (!this.id() || !this.type()) return;
    this._castService.fetchCastList(this.type(), this.id()).subscribe({
      next: (res) => {
        this.castDetails.set(res);
      },
      error: (err) => {
        console.error('Failed to fetch cast details', err);
      },
    });
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen.update((v) => !v);
  }
}
