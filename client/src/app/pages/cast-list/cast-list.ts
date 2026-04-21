import { Component, input } from '@angular/core';
import { CastInfo } from '../../models/cast-response.model';

@Component({
  selector: 'app-cast-list',
  imports: [],
  templateUrl: './cast-list.html',
  styleUrl: './cast-list.scss',
})
export class CastList {
  castList = input<CastInfo[] | null>(null);
}
