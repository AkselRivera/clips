import { DatePipe } from '@angular/common';
import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videoJs from 'video.js';
import IClip from '../models/clip.models';

@Component({
    selector: 'app-clip',
    templateUrl: './clip.component.html',
    styleUrls: ['./clip.component.css'],
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None,
})
export class ClipComponent implements OnInit {
    @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
    player?: videoJs.Player;
    clip?: IClip;

    constructor(public route: ActivatedRoute) {}

    ngOnInit(): void {
        this.player = videoJs(this.target?.nativeElement);

        this.route.data.subscribe((data) => {
            this.clip = data['clip'] as IClip;

            this.player?.src({
                src: this.clip.url,
                type: 'video/mp4',
            });
        });
    }
}
