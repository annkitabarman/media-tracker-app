import { Component, signal, inject, ElementRef } from '@angular/core';
import { WATCH_STATUS } from '../../constants/dropdown-menu';
import { FILTERS_DROPDOWN } from '../../constants/filters-dropdown';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-ratings-filters',
  imports: [],
  templateUrl: './ratings-filters.html',
  styleUrl: './ratings-filters.scss',
})
export class RatingsFilters {
  private elementRef = inject(ElementRef);
  watchStatus = Object.values(WATCH_STATUS);
  FILTERS_DROPDOWN = FILTERS_DROPDOWN;

  activeWatchStatus = signal(WATCH_STATUS.ALL);
  isDropDownOpen = signal<string | null>(null);

  selectedFilters = signal<Record<string, string>>({
    format: '',
    genre: '',
    status: '',
  });

  setActiveWatchStatus(status: string) {
    this.activeWatchStatus.set(status);
  }

  toggleDropDown(s: string) {
    this.isDropDownOpen.set(this.isDropDownOpen() === s ? null : s);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isDropDownOpen.set(null);
    }
  }
}
