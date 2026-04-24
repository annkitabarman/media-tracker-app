import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ratings } from '../../components/ratings/ratings';
import { Favourites } from '../../components/favourites/favourites';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-profile',
  imports: [Ratings, Favourites],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  section = signal<string>('');

  ngOnInit() {
    this._activatedRoute.params
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((params) => {
        const section = params['section'];
        this.section.set(section);
      });
  }
}
