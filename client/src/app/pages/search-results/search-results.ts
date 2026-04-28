import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchResultList } from '../../components/search-result-list/search-result-list';
import { SharedService } from '../../services/shared-service';
import { SearchResultItem } from '../../models/search-result.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  imports: [SearchResultList],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults implements OnInit {
  private readonly _router = inject(Router);
  private readonly _sharedService = inject(SharedService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  searchResults = signal<SearchResultItem[] | null>(null);
  searchText = signal<string>('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  ngOnInit() {
    this._activatedRoute.queryParamMap.subscribe((params) => {
      const query = params.get('q') ?? '';
      const page = params.get('page');
      this.currentPage.set(Number(page));
      this.searchText.set(query);
      this.fetchSearchResult();
    });
  }

  fetchSearchResult(): void {
    this._sharedService
      .fetchSearchResults(this.searchText(), this.currentPage())
      .subscribe({
        next: (res) => {
          this.searchResults.set(res.results);
          this.totalPages.set(res.totalPages);
        },
        error: (err) => {
          console.error('error fetching search results', err);
        },
      });
  }

  goToPage(page: number) {
    this._router.navigate([], {
      queryParams: {
        q: this.searchText(),
        page,
      },
    });
  }
}
