export interface GuideCard {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string;
  tagColor: string;
  slug?: string;
}

export interface SearchResult {
  name: string;
  description: string;
  rating: string;
  location: string;
}

export interface SearchResponse {
  recommendations: SearchResult[];
}
