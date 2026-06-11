import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-discover-filter',
  imports: [],
  templateUrl: './discover-filter.html',
  styleUrl: './discover-filter.scss',
})
export class DiscoverFilter {
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

  selectedSortLabel = signal<string>(this.sortOptions[0].label);
  selectedSortValue = signal<string>(this.sortOptions[0].value);

  sortToggle = signal<boolean>(false);

  toggleSortOptions() {
    this.sortToggle.set(!this.sortToggle());
  }
}
