import {
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gif-trending-page',
  imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent {
  gifsServices = inject(GifsService);

  scrollDivRef = viewChild<ElementRef>('groupDiv');

  gifs = computed(() => this.gifsServices.trendingGifs());

  onScroll($event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
  }
}
