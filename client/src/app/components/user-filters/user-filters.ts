import {
  Component,
  signal,
  inject,
  ElementRef,
  OnInit,
  computed,
  output,
} from '@angular/core';
import {
  FILTERS_DROPDOWN,
  SORT_OPTIONS,
} from '../../constants/filters-dropdown';
import { HostListener } from '@angular/core';
import { SharedService } from '../../services/shared-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-filters',
  imports: [],
  templateUrl: './user-filters.html',
  styleUrl: './user-filters.scss',
})
export class UserFilters implements OnInit {
  private readonly _sharedService = inject(SharedService);
  private readonly elementRef = inject(ElementRef);
  filters = signal(FILTERS_DROPDOWN);
  SORT_OPTIONS = SORT_OPTIONS;
  genreFiltersIds = signal<{ id: number; name: string }[]>([]);

  isDropDownOpen = signal<string | null>(null);
  hoveredFilter = signal<string | null>(null);
  ascOrder = signal<boolean>(true);

  selectedFilters = signal<Record<string, string>>({
    format: '',
    genre: '',
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

  changeSortOrder() {
    this.ascOrder.set(!this.ascOrder());
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
        updatedFilters[1].options = genreOptions;
        return updatedFilters;
      });
    });
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
