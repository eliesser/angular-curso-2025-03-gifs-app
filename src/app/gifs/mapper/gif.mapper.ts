import { Gif } from '../interfaces/gif.interface';
import { IGiphyItem } from '../interfaces/giphy.interfaces';

export class GifMapper {
  static mapGiphyItemToGif(giphyItem: IGiphyItem): Gif {
    return {
      id: giphyItem.id,
      title: giphyItem.title,
      url: giphyItem.images.original.url,
    };
  }

  static mapGiphyItemsToGifArray(giphyItems: IGiphyItem[]): Gif[] {
    return giphyItems.map((giphyItem) => this.mapGiphyItemToGif(giphyItem));
  }
}
