import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
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
import { ADD_TO_LIST_MENU } from '../../constants/dropdown-menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddRatingPopup } from '../../components/add-rating-popup/add-rating-popup';

@Component({
  selector: 'app-media-details',
  imports: [
    DatePipe,
    MinutesToHoursPipe,
    CastCard,
    CurrencyPipe,
    AddRatingPopup,
  ],
  templateUrl: './media-details.html',
  styleUrl: './media-details.scss',
})
export class MediaDetails implements OnInit {
  private readonly _activateRoute = inject(ActivatedRoute);
  private readonly _movieesService = inject(MoviesService);
  private readonly _castService = inject(CastService);
  private readonly _sharedService = inject(SharedService);
  private readonly _destroyRef = inject(DestroyRef);
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef<HTMLElement>;
  menuValues = Object.values(ADD_TO_LIST_MENU);
  id = signal<number>(0);
  type = signal<'movie' | 'tv'>('movie');
  genreList = signal<string[] | undefined>([]);
  mediaData = signal<MediaDetailsResponse | null>(null);
  isDropdownOpen = signal<boolean>(false);
  radius = signal<number>(25);
  originalLang = signal<string>('English');
  keywordsList = signal<KeyWordsResponse['keywords']>([]);
  showToast = signal<boolean>(false);

  castDetails = signal<CastDetailsResponse | null>(null);
  isPopupOpen = signal<boolean>(false);

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
    return Math.round(this.mediaData()?.vote_average ?? 0) * 10;
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

    this._movieesService.fetchKeywords(this.id(), this.type()).subscribe({
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
    this._movieesService.fetchMediaDetails(this.id(), this.type()).subscribe({
      next: (res) => {
        this.mediaData.set(res);
        this.generateGenreList();
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.dropdownWrapper) return;

    const clickedInside = this.dropdownWrapper.nativeElement.contains(
      event.target as Node,
    );

    if (!clickedInside) {
      this.isDropdownOpen.set(false);
    }
  }

  openAddRatingPopup() {
    this.isPopupOpen.set(true);
    document.documentElement.style.overflow = 'hidden'; // html
    document.body.style.overflow = 'hidden';
  }

  closePopup() {
    this.isPopupOpen.set(false);
    document.documentElement.style.overflow = ''; // html
    document.body.style.overflow = '';
  }
}
