import { Component } from '@angular/core';
import { TrendingSection } from '../../components/trending-section/trending-section';

@Component({
  selector: 'app-home-page',
  imports: [TrendingSection],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
