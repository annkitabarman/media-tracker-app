export interface RatedMediaModel {
  name: string;
  year: number;
  poster: string;
  rating: number;
  mediaType: 'movie' | 'tv';
  id: number;
  notes: string;
  watchStatus: string;
}
