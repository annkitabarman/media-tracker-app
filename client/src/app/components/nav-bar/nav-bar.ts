import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  isFullScreenSearchVisible = signal(false);
  toggleMenu() {
    console.log('Menu toggled');
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
}
