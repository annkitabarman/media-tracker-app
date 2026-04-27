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
import { RatedMediaModel } from '../../models/rated-media.model';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-rating-popup',
  imports: [ReactiveFormsModule],
  templateUrl: './add-rating-popup.html',
  styleUrl: './add-rating-popup.scss',
})
export class AddRatingPopup {
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;
  private readonly _formBuilder = inject(FormBuilder);
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
  mediaType = input<'movie' | 'tv'>('movie');
  ratingOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  form = this._formBuilder.nonNullable.group({
    watchStatus: [WATCH_STATUS.WATCHING],
    rating: [0],
    notes: [''],
  });

  selectStatus(s: string) {
    this.form.patchValue({
      watchStatus: s,
    });
  }
  closePopup() {
    this.closePopupEmitter.emit();
  }

  toggleDropdown(event: any) {
    event.stopPropagation();
    this.isDropDownOpen.update((v) => !v);
  }

  private getReleaseYear(date?: string): number {
    return date ? Number(date.slice(0, 4)) : 0;
  }

  addNewRating() {
    const payload: RatedMediaModel = {
      ...this.form.getRawValue(),
      name: this.mediaData()?.name || this.mediaData()?.title || '',
      year: this.getReleaseYear(this.mediaData()?.release_date),
      poster: this.mediaData()?.poster_path || '',
      mediaType: this.mediaType(),
      id: this.mediaData()?.id || -1,
    };
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
