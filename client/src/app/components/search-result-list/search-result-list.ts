import { Component, input, output } from '@angular/core';
import { SearchResultItem } from '../../models/search-result.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-result-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './search-result-list.html',
  styleUrl: './search-result-list.scss',
})
export class SearchResultList {
  searchResult = input<SearchResultItem[] | null>(null);
  pageChange = output<number>();
  currentPage = input<number>(1);
  totalPages = input<number>(1);
}
