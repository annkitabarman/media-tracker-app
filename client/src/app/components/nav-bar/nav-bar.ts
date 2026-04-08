import {
  Component,
  HostListener,
  signal,
  computed,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  MOVIES_MENU,
  TV_SHOWS_MENU,
  USER_MENU,
} from '../../constants/dropdown-menu';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  @ViewChild('menuContainer') menuContainer!: ElementRef;
  @ViewChild('userMenuContainer') userMenuContainer!: ElementRef;
  isFullScreenSearchVisible = signal(false);
  clickedMenu = signal<string | null>(null);
  USER_MENU = USER_MENU;
  isUserMenuClicked = signal<boolean>(false);

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
    console.log('Search box toggled');
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 640) {
      this.isFullScreenSearchVisible.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
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
