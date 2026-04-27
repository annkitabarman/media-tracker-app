import {
  Component,
  output,
  input,
  signal,
  HostListener,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { MediaDetailsResponse } from '../../models/movie-response.model';
import { WATCH_STATUS } from '../../constants/dropdown-menu';
import { MoviesService } from '../../services/movies-service';

@Component({
  selector: 'app-add-rating-popup',
  imports: [],
  templateUrl: './add-rating-popup.html',
  styleUrl: './add-rating-popup.scss',
})
export class AddRatingPopup {
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;
  private readonly _moviesService = inject(MoviesService);
  isPopupOpen = input<boolean>(false);
  closePopupEmitter = output<void>();
  mediaData = input<MediaDetailsResponse | null>(null);
  WATCH_STATUS = WATCH_STATUS;
  watchStatusDropdown = Object.values(WATCH_STATUS).filter(
    (s) => s !== WATCH_STATUS.ALL,
  );
  ratingSavedEmitter = output<void>();

  isDropDownOpen = signal<boolean>(false);

  closePopup() {
    this.closePopupEmitter.emit();
  }

  toggleDropdown(event: any) {
    event.stopPropagation();
    this.isDropDownOpen.update((v) => !v);
  }

  addNewRating() {
    this.closePopup();
    this.ratingSavedEmitter.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.dropdownWrapper) return;

    const clickedInside = this.dropdownWrapper.nativeElement.contains(
      event.target as Node,
    );

    if (!clickedInside) {
      this.isDropDownOpen.set(false);
    }
  }
}
