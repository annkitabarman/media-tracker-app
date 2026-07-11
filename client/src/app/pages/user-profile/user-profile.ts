import {
  Component,
  inject,
  OnInit,
  signal,
  DestroyRef,
  computed,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { UserFilters } from '../../components/user-filters/user-filters';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectLibraryItems } from '../../store/library/library.selectors';
import { DisplayLibrary } from '../../components/display-library/display-library';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, UserFilters, DisplayLibrary],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  section = signal<string>('');

  ngOnInit() {
    this._activatedRoute.params
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((params) => {
        const section = params['section'];
        this.section.set(section);
      });
  }

  toggleSection(type: string) {
    this.section.set(type);
  }

  private readonly _store = inject(Store);
  appliedFilter = signal<Record<string, string>>({
    format: '',
    genre: '',
    year: '',
    sort: 'title',
    search: '',
  });
  updateSearch(s: string) {
    this.appliedFilter.update((prev) => ({
      ...prev,
      search: s.toLowerCase(),
    }));
  }

  allLibraryItems = toSignal(this._store.select(selectLibraryItems), {
    initialValue: [],
  });

  applyFilter(filter: Record<string, string>) {
    this.appliedFilter.set(filter);
  }

  filteredItems = computed(() => {
    const items = this.allLibraryItems();
    const filters = this.appliedFilter();

    let result = [...items];

    result = result.filter((item) =>
      item.watch_status?.includes(this.section()),
    );

    if (filters['search']) {
      const search = filters['search'];
      result = result.filter((i) => i.name.toLowerCase().includes(search));
    }

    if (filters['genre']) {
      result = result.filter((i) => i.genre?.includes(filters['genre']));
    }

    if (filters['format']) {
      result = result.filter((i) => i.mediaType === filters['format']);
    }

    if (filters['year']) {
      result = result.filter((i) => i.year.startsWith(filters['year']));
    }

    switch (filters['sort']) {
      case 'title':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'date_added':
        result = [...result].sort(
          (a, b) =>
            new Date(a.dateAdded ?? 0).getTime() -
            new Date(b.dateAdded ?? 0).getTime(),
        );
        break;

      case 'release_date':
        result = [...result].sort(
          (a, b) =>
            new Date(a.year ?? 0).getTime() - new Date(b.year ?? 0).getTime(),
        );
        break;
    }

    return filters['sort_order'] === 'desc' ? [...result].reverse() : result;
  });
}
