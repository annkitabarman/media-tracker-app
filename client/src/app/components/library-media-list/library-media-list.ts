import { Component, input, signal } from '@angular/core';
import { LibraryMediaModel } from '../../models/library-media.model';
import { DatePipe } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-library-media-list',
  imports: [DatePipe, UpperCasePipe, NgClass, RouterLink],
  templateUrl: './library-media-list.html',
  styleUrl: './library-media-list.scss',
})
export class LibraryMediaList {
  item = input<LibraryMediaModel | null>(null);
  markAsWatched = signal<boolean>(false);

  toggleWatched() {
    this.markAsWatched.set(!this.markAsWatched());
  }

  get mediatype(): string | null {
    const data = this.item();
    if (data?.mediaType === 'movie') return 'Movie';
    else return 'TV Show';
  }
  currentYear = new Date().getFullYear();
}
