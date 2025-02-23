import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GifsService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';
import { GifListComponent } from '../../components/gif-list/gif-list.component';

@Component({
  selector: 'gifs-gif-history',
  imports: [GifListComponent],
  templateUrl: './gif-history.component.html',
})
export default class GifHistoryComponent {
  key = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['key']))
  );

  gifService = inject(GifsService);

  gifByKey = computed(() => {
    return this.gifService.getHistoryGifs(this.key());
  });
}
