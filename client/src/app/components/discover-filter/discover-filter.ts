import { Component, signal, inject, output } from '@angular/core';
import { FlatpickrDirective } from 'angularx-flatpickr';
import { SharedService } from '../../services/shared-service';
import { forkJoin } from 'rxjs';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discover-filter',
  imports: [FlatpickrDirective, ReactiveFormsModule, CommonModule],
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
  emitFilters = output<{
    sort: string | null;
    genres: number[] | null;
    from_date: string | null;
    to_date: string | null;
  }>();

  filterForm = new FormGroup({
    sort: new FormControl<string>(''),
    genres: new FormControl<number[]>([]),
    from_date: new FormControl<string>(''),
    to_date: new FormControl<string>(''),
  });

  get noFiltersSelected(): boolean {
    const value = this.filterForm.getRawValue();

    return Object.values(value).every((value) =>
      Array.isArray(value) ? value.length === 0 : value === '',
    );
  }
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
    this.filterForm.controls.sort.setValue(option.value);
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

  isGenreSelected(id: number) {
    return this.filterForm.controls.genres.value?.includes(id);
  }

  clearDates() {
    this.filterForm.controls.from_date.setValue('');
    this.filterForm.controls.to_date.setValue('');
  }

  addGenres(id: number) {
    const genres = this.filterForm.controls.genres.value ?? [];
    if (genres.includes(id)) {
      this.filterForm.controls.genres.setValue(genres.filter((g) => g !== id));
    } else {
      this.filterForm.controls.genres.setValue([...genres, id]);
    }
  }

  applySearch() {
    this.emitFilters.emit(this.filterForm.getRawValue());
  }
}
