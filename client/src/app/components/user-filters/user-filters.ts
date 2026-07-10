import {
  Component,
  signal,
  inject,
  ElementRef,
  OnInit,
  computed,
  output,
  DestroyRef,
} from '@angular/core';
import {
  FILTERS_DROPDOWN,
  SORT_OPTIONS,
} from '../../constants/filters-dropdown';
import { HostListener } from '@angular/core';
import { SharedService } from '../../services/shared-service';
import { forkJoin } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './user-filters.html',
  styleUrl: './user-filters.scss',
})
export class UserFilters implements OnInit {
  private readonly _sharedService = inject(SharedService);
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  filters = signal(FILTERS_DROPDOWN);
  SORT_OPTIONS = SORT_OPTIONS;
  genreFiltersIds = signal<{ id: number; name: string }[]>([]);
  emitFilter = output<Record<string, string>>();
  searchChange = output<string>();
  searchText = new FormControl('');

  isDropDownOpen = signal<string | null>(null);
  hoveredFilter = signal<string | null>(null);
  ascOrder = signal<boolean>(true);

  selectedFilters = signal<Record<string, string>>({
    format: '',
    genre: '',
    year: '',
    sort: 'title',
    sort_order: 'asc',
    search: '',
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

    this.searchText.valueChanges
      .pipe(
        map((v) => v?.trim() ?? ''),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.searchChange.emit(value);
      });
  }

  sortDisplayValue = computed(() => {
    const key = this.selectedFilters()['sort'];
    const option = SORT_OPTIONS.find((opt) => opt.key === key);
    return option ? option.label : key;
  });

  changeSortOrder() {
    this.ascOrder.set(!this.ascOrder());
    if (this.ascOrder()) {
      this.selectedFilters.update((prev) => ({
        ...prev,
        sort_order: 'asc',
      }));
    } else {
      this.selectedFilters.update((prev) => ({
        ...prev,
        sort_order: 'desc',
      }));
    }
    this.emitFilter.emit(this.selectedFilters());
  }

  populateGenres() {
    const movie$ = this._sharedService.movieGenre$;
    const tv$ = this._sharedService.tvGenre$;

    forkJoin([movie$, tv$]).subscribe(([movieGenre, tvGenre]) => {
      const merged = { ...movieGenre, ...tvGenre };

      this.genreFiltersIds.set(
        Object.entries(merged).map(([id, name]) => ({
          id: Number(id),
          name,
        })),
      );

      this.filters.update((filters) =>
        filters.map((filter) =>
          filter.key === 'genre'
            ? {
                ...filter,
                options: Object.entries(merged).map(([id, name]) => ({
                  label: name,
                  value: name,
                })),
              }
            : filter,
        ),
      );
    });
  }

  applyFilter(filterKey: string, option: string) {
    this.selectedFilters.update((filters) => ({
      ...filters,
      [filterKey]: option,
    }));
    this.isDropDownOpen.set(null);
    this.emitFilter.emit(this.selectedFilters());
  }

  filterHovered(filterKey: string | null) {
    this.hoveredFilter.set(filterKey);
  }

  clearFilter(filterKey: string) {
    this.selectedFilters.update((filters) => ({
      ...filters,
      [filterKey]: '',
    }));
    this.emitFilter.emit(this.selectedFilters());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isDropDownOpen.set(null);
    }
  }
}
