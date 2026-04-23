import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this._activatedRoute.params.subscribe((params) => {
      const section = params['section'];
      console.log('Current section:', section);
    });
  }
}
