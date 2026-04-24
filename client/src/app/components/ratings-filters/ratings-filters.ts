import {
  Component,
  signal,
  inject,
  ElementRef,
  OnInit,
  computed,
} from '@angular/core';
import { WATCH_STATUS } from '../../constants/dropdown-menu';
import {
  FILTERS_DROPDOWN,
  SORT_OPTIONS,
} from '../../constants/filters-dropdown';
import { HostListener } from '@angular/core';
import { SharedService } from '../../services/shared-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ratings-filters',
  imports: [],
  templateUrl: './ratings-filters.html',
  styleUrl: './ratings-filters.scss',
})
export class RatingsFilters implements OnInit {
  private _sharedService = inject(SharedService);
  private elementRef = inject(ElementRef);
  watchStatus = Object.values(WATCH_STATUS);
  filters = signal(FILTERS_DROPDOWN);
  SORT_OPTIONS = SORT_OPTIONS;
  genreFiltersIds = signal<{ id: number; name: string }[]>([]);

  activeWatchStatus = signal(WATCH_STATUS.ALL);
  isDropDownOpen = signal<string | null>(null);
  hoveredFilter = signal<string | null>(null);

  selectedFilters = signal<Record<string, string>>({
    format: '',
    genre: '',
    status: '',
    year: '',
    sort: 'title',
  });
  dropdownDirection = signal<'up' | 'down'>('down');

  toggleDropDown(key: string, event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const estimatedHeight = 260;

    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      this.dropdownDirection.set('up');
    } else {
      this.dropdownDirection.set('down');
    }

    this.isDropDownOpen.set(this.isDropDownOpen() === key ? null : key);
  }

  ngOnInit() {
    this.populateGenres();
  }

  sortDisplayValue = computed(() => {
    const key = this.selectedFilters()['sort'];
    const option = SORT_OPTIONS.find((opt) => opt.key === key);
    return option ? option.label : key;
  });

  setYear(year: string) {
    this.selectedFilters.update((filters) => ({
      ...filters,
      year,
    }));
  }

  populateGenres() {
    const movie$ = this._sharedService.movieGenre$;
    const tv$ = this._sharedService.tvGenre$;

    forkJoin([movie$, tv$]).subscribe(([movieGenre, tvGenre]) => {
      const merged = { ...movieGenre, ...tvGenre };
      this.genreFiltersIds.set(
        Object.entries(merged).map(([id, name]) => ({ id: Number(id), name })),
      );
      const genreOptions = Object.values(merged);

      this.filters.update((filters) => {
        const updatedFilters = [...filters];
        updatedFilters[2].options = genreOptions;
        return updatedFilters;
      });
    });
  }
  setActiveWatchStatus(status: string) {
    this.activeWatchStatus.set(status);
  }

  applyFilter(filterKey: string, option: string) {
    this.selectedFilters.update((filters) => ({
      ...filters,
      [filterKey]: option,
    }));
    this.isDropDownOpen.set(null);
  }

  filterHovered(filterKey: string | null) {
    this.hoveredFilter.set(filterKey);
  }

  clearFilter(filterKey: string) {
    this.selectedFilters.update((filters) => ({
      ...filters,
      [filterKey]: '',
    }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isDropDownOpen.set(null);
    }
  }
}
