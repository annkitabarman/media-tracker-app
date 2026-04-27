export interface RatedMediaModel {
  name: string;
  year: string;
  poster: string;
  rating: number;
  mediaType: 'movie' | 'tv';
  id: number;
  tags: string;
  currentEpisode: number;
  totalEpisodes: number;
}
