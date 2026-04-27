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
} from '../../constants/dropdown-menu';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs';
import { SharedService } from '../../services/shared-service';
import { SuggestionItem } from '../../models/search-result.model';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, ReactiveFormsModule, DatePipe, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar implements OnInit {
  private readonly _sharedService = inject(SharedService);
  @ViewChild('menuContainer') menuContainer!: ElementRef;
  @ViewChild('userMenuContainer') userMenuContainer!: ElementRef;
  @ViewChild('searchContainer') searchContainer!: ElementRef;
  isFullScreenSearchVisible = signal(false);
  clickedMenu = signal<string | null>(null);
  USER_MENU = USER_MENU;
  isUserMenuClicked = signal<boolean>(false);
  suggestions = signal<SuggestionItem[]>([]);
  showSuggestions = signal<boolean>(false);

  searchText = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.searchText.valueChanges
      .pipe(
        debounceTime(500),
        map((v) => v.trim()),
        distinctUntilChanged(),
        filter((v) => v.length > 2),
      )
      .subscribe((value) => {
        this._sharedService.fetchSuggestions(value).subscribe({
          next: (res) => {
            this.suggestions.set(res);
            this.showSuggestions.set(true);
          },
        });
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
