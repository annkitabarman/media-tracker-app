import { Component, signal, inject, computed } from '@angular/core';
import { FlatpickrDirective } from 'angularx-flatpickr';
import { SharedService } from '../../services/shared-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-discover-filter',
  imports: [FlatpickrDirective],
  templateUrl: './discover-filter.html',
  styleUrl: './discover-filter.scss',
})
export class DiscoverFilter {
  readonly _sharedService = inject(SharedService);
  sortOptions = [
    { label: 'Popularity Descending', value: 'popularity.desc' },
    { label: 'Popularity Ascending', value: 'popularity.asc' },
    { label: 'Release Date Descending', value: 'release_date.desc' },
    { label: 'Release Date Ascending', value: 'release_date.asc' },
    { label: 'Rating Descending', value: 'vote_average.desc' },
    { label: 'Rating Ascending', value: 'vote_average.asc' },
    { label: 'Title (A-Z)', value: 'original_title.asc' },
    { label: 'Title (Z-A)', value: 'original_title.desc' },
  ];

  movieGenres = signal<{ id: number; name: string }[]>([]);
  tvGenres = signal<{ id: number; name: string }[]>([]);

  selectedFilter = {
    sort: '',
    genre: '',
    release_date: '',
    keywords: '',
  };

  noFiltersSelected = computed(() =>
    Object.values(this.selectedFilter).every((value) => value === ''),
  );

  constructor() {
    this.populateGenres();
  }

  selectedSortLabel = signal<string>(this.sortOptions[0].label);
  selectedSortValue = signal<string>(this.sortOptions[0].value);

  sortDropdownToggle = signal<boolean>(false);
  sortVisible = signal<boolean>(false);
  filterVisible = signal<boolean>(false);

  toggleSortVisibility() {
    this.sortVisible.set(!this.sortVisible());
  }

  toggleFilterVisibility() {
    this.filterVisible.set(!this.filterVisible());
  }

  toggleSortOptions() {
    this.sortDropdownToggle.set(!this.sortDropdownToggle());
  }

  updateSortOption(option: { label: string; value: string }) {
    this.selectedSortLabel.set(option.label);
    this.selectedSortValue.set(option.value);
    this.sortDropdownToggle.set(false);
  }

  populateGenres() {
    const movie$ = this._sharedService.movieGenre$;
    const tv$ = this._sharedService.tvGenre$;

    forkJoin([movie$, tv$]).subscribe(([movieGenre, tvGenre]) => {
      const merged = { ...movieGenre, ...tvGenre };
      this.movieGenres.set(
        Object.entries(movieGenre).map(([id, name]) => ({
          id: Number(id),
          name,
        })),
      );

      this.tvGenres.set(
        Object.entries(tvGenre).map(([id, name]) => ({
          id: Number(id),
          name,
        })),
      );
    });
  }
}
