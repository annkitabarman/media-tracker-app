import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  imports: [],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  searchText = signal<string>('');
  ngOnInit() {
    this._route.queryParams.subscribe((params) => {
      const query = params['q'];
      this.searchText.set(query);
    });
  }
}
