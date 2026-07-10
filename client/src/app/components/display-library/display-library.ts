import { Component, input, signal } from '@angular/core';
import { LibraryMediaList } from '../library-media-list/library-media-list';
import { LibraryMediaModel } from '../../models/library-media.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-display-library',
  imports: [LibraryMediaList, RouterLink],
  templateUrl: './display-library.html',
  styleUrl: './display-library.scss',
})
export class DisplayLibrary {
  watchStatus = input<string>();

  watchList = input<LibraryMediaModel[] | null>(null);
}
