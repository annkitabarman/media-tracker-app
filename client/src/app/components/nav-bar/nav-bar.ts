import {
  Component,
  HostListener,
  signal,
  computed,
  ViewChild,
  ElementRef,
  OnInit,
  inject,
} from '@angular/core';
import {
  MOVIES_MENU,
  TV_SHOWS_MENU,
  USER_MENU,
  MEDIA_FILTER_MENU,
} from '../../constants/dropdown-menu';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs';
import { SharedService } from '../../services/shared-service';
import { SuggestionItem } from '../../models/search-result.model';
import { DatePipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, ReactiveFormsModule, DatePipe, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar implements OnInit {
  private readonly _sharedService = inject(SharedService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  @ViewChild('menuContainer') menuContainer!: ElementRef;
  @ViewChild('userMenuContainer') userMenuContainer!: ElementRef;
  @ViewChild('searchContainer') searchContainer!: ElementRef;
  @ViewChild('filterContainer') filterContainer!: ElementRef;
  private readonly _router = inject(Router);
  isFullScreenSearchVisible = signal(false);
  clickedMenu = signal<string | null>(null);
  USER_MENU = USER_MENU;
  MEDIA_FILTER_MENU = Object.values(MEDIA_FILTER_MENU);
  isUserMenuClicked = signal<boolean>(false);
  suggestions = signal<SuggestionItem[]>([]);
  showSuggestions = signal<boolean>(false);
  filterDropdown = signal<boolean>(false);
  selectedFilter = signal<string>('All');

  toggleFilterDropdown() {
    this.filterDropdown.set(!this.filterDropdown());
  }

  updateFilter(s: string) {
    this.selectedFilter.set(s);
    this.toggleFilterDropdown();
  }

  filterValue = computed(() => {
    switch (this.selectedFilter()) {
      case 'Movies':
        return 'movie';
      case 'TV Shows':
        return 'tv';

      default:
        return '';
    }
  });

  searchText = new FormControl('');

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((params) => {
      let query = params['q'];
      if (query) {
        // Remove the word "search" (case-insensitive, whole word)
        query = query.replace(/\bsearch\b/gi, '').trim();
      }
      this.searchText.setValue(query, {
        emitEvent: false,
      });
    });

    this.searchText.valueChanges
      .pipe(
        debounceTime(500),
        map((v) => v?.trim() ?? ''),
        distinctUntilChanged(),
        filter((v) => v.length > 2),
      )
      .subscribe((value) => {
        this._sharedService
          .fetchSuggestions(value ?? '', this.filterValue())
          .subscribe({
            next: (res) => {
              this.suggestions.set(res);
              this.showSuggestions.set(true);
            },
          });
      });
  }

  showSearchResults(s: SuggestionItem) {
    this.showSuggestions.set(false);
    if (s.type == 'result') {
      this._router.navigate(['/', s.media_type, s.id]);
      this.searchText.setValue('');
      this.selectedFilter.set('All');
      return;
    }

    this._router.navigate(['/search'], {
      queryParams: { q: s.label, page: 1, type: this.filterValue() },
    });
  }

  isMovieClicked = computed(() => {
    return this.clickedMenu() === 'movies';
  });

  isTvShowClicked = computed(() => {
    return this.clickedMenu() === 'tv-shows';
  });

  selectedMenuDropdown = computed(() => {
    if (this.isMovieClicked()) return MOVIES_MENU;
    if (this.isTvShowClicked()) return TV_SHOWS_MENU;
    return [];
  });

  toggleUserMenu() {
    this.isUserMenuClicked.set(!this.isUserMenuClicked());
  }

  displayOptions() {
    console.log('Options displayed');
  }

  toggleSearchBox() {
    this.isFullScreenSearchVisible.set(!this.isFullScreenSearchVisible());
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 640) {
      this.isFullScreenSearchVisible.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const filterClick = this.filterContainer.nativeElement.contains(
      event.target,
    );

    if (!filterClick) {
      this.filterDropdown.set(false);
    }
    const clickedInside = this.searchContainer.nativeElement.contains(
      event.target,
    );

    if (!clickedInside) {
      this.showSuggestions.set(false);
    }
    if (
      this.menuContainer &&
      !this.menuContainer.nativeElement.contains(event.target as Node)
    ) {
      this.clickedMenu.set(null);
    }
    if (
      this.userMenuContainer &&
      !this.userMenuContainer.nativeElement.contains(event.target as Node)
    ) {
      this.isUserMenuClicked.set(false);
    }
  }

  openMenuDropdown(menu: string): void {
    if (this.clickedMenu() === menu) this.clickedMenu.set(null);
    else this.clickedMenu.set(menu);
  }
}
