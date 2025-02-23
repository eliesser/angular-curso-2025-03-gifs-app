import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { IGiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

function loadGifsFromLocalStorage(): Record<string, Gif[]> {
  const searchHistory = localStorage.getItem('search-history');
  return searchHistory ? JSON.parse(searchHistory) : [];
}

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(true);

  trendingGifsGroup = computed<Gif[][]>(() => {
    const groups = [];

    for (let index = 0; index < this.trendingGifs().length; index += 3) {
      groups.push(this.trendingGifs().slice(index, index + 3));
    }

    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>(loadGifsFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  saveGifsToLocalStorage = effect(() => {
    localStorage.setItem(
      'search-history',
      JSON.stringify(this.searchHistory())
    );
  });

  private http = inject(HttpClient);

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs(): void {
    this.http
      .get<IGiphyResponse>(`${environment.apiUrl}/gifs/trending`, {
        params: {
          api_key: environment.apiKeyGiphy,
          limit: 25,
          offset: 0,
          rating: 'g',
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<IGiphyResponse>(`${environment.apiUrl}/gifs/search`, {
        params: {
          api_key: environment.apiKeyGiphy,
          limit: 25,
          offset: 0,
          q: query,
        },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
        tap((items) => {
          this.searchHistory.update((prev) => ({
            ...prev,
            [query.toLocaleLowerCase()]: items,
          }));
        })
      );
  }

  getHistoryGifs(key: string): Gif[] {
    return this.searchHistory()[key.toLocaleLowerCase()] || [];
  }
}
