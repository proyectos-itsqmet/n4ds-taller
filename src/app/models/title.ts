export interface Title {
  id?: number;
  name: string;
  type: 'MOVIE' | 'SERIES';
  year: number;
  genre: string;
  synopsis: string;
  rating: number;
  posterUrl: string;
}
