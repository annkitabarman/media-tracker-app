import { Component, input, OnChanges, OnInit } from '@angular/core';
import { TrendingMediaType } from '../../models/movie-response.model';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recommendations-component',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './recommendations-component.html',
  styleUrl: './recommendations-component.scss',
})
export class RecommendationsComponent {
  recommendationsList = input<TrendingMediaType[]>([]);
}
