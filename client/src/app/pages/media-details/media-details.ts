import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
  computed,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies-service';
import { MediaDetailsResponse } from '../../models/movie-response.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-media-details',
  imports: [DatePipe],
  templateUrl: './media-details.html',
  styleUrl: './media-details.scss',
})
export class MediaDetails implements OnInit {
  private readonly _activateRoute = inject(ActivatedRoute);
  private readonly _movieesService = inject(MoviesService);
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef<HTMLElement>;
  id = signal<number>(0);
  type = signal<'movie' | 'tv'>('movie');
  genreList = signal<string[] | undefined>([]);
  mediaData = signal<MediaDetailsResponse | null>(null);
  isDropdownOpen = signal<boolean>(false);
  radius = signal<number>(25);

  circumference = computed(() => {
    return 2 * Math.PI * this.radius();
  });

  dashOffset = computed(() => {
    return (
      this.circumference() * (1 - (this.mediaData()?.vote_average ?? 0) / 10)
    );
  });

  get percentage() {
    return Math.round(this.mediaData()?.vote_average ?? 0) * 10;
  }

  ngOnInit(): void {
    this.fetchMediaData();
  }

  generateGenreList() {
    const genres = this.mediaData()?.genres.map((genre) => {
      return genre.name;
    });
    this.genreList.set(genres ?? []);
  }

  fetchMediaData() {
    this._activateRoute.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.id.set(id);
      const type = params.get('type');
      if (type === 'movie' || type === 'tv') {
        this.type.set(type);
      } else {
        this.type.set('movie');
      }

      this._movieesService.fetchMediaDetails(id, this.type()).subscribe({
        next: (res) => {
          this.mediaData.set(res);
          this.generateGenreList();
        },
        error: (err) => {
          console.error('Something went wrong!!', err);
        },
      });
    });
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.dropdownWrapper) return;

    const clickedInside = this.dropdownWrapper.nativeElement.contains(
      event.target as Node,
    );

    if (!clickedInside) {
      this.isDropdownOpen.set(false);
    }
  }
}
