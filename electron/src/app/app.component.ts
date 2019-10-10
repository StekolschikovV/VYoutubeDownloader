import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {StoreService} from './shared/store.service';
import {VideoInfo} from '../../dataType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchUrl = '';

  constructor(public store: StoreService, private cdr: ChangeDetectorRef) {

  }

  search() {
    this.store.getInfo(this.searchUrl);
  }

  keyDownFunction($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.search();
    }
  }

  openFileDialog() {
    document.getElementById('business').click();
  }

  setUserAppPath(e) {
    this.store.path.next(e.target.files[0].path);
  }

  selectVideo( el: VideoInfo) {
    this.store.selectVideo(el);
  }

  downloadSelected() {
    this.store.downloadSelected();
  }

  ngOnInit(): void {
    this.store.path.subscribe((e) => {
      this.cdr.detectChanges();
    });
    this.store.isInfoLoadNow.subscribe((e) => {
      this.cdr.detectChanges();
    });
    this.store.video.subscribe((e) => {
      this.cdr.detectChanges();
    });
    this.store.videoShadow.subscribe((e) => {
      this.cdr.detectChanges();
    });
  }

  selectAll() {
    this.store.selectAll();
  }

  downloadStop() {
    this.store.downloadStop();

  }

  searchStop() {
    this.store.searchStop();
  }

  rmSelected() {
    this.store.rmSelected();
  }

  selectFormat(value: any, el: VideoInfo) {
    // console.log(
    //   value,
    //   el
    // );
    this.store.selectFormat(value, el);
  }


}
