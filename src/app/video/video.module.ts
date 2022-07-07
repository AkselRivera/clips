import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VideoRoutingModule } from './video-routing.module';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { SharedModule } from '../shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
    declarations: [ManageComponent, UploadComponent, EditComponent, SafeUrlPipe],
    imports: [
        CommonModule,
        VideoRoutingModule,
        SharedModule,
        ReactiveFormsModule,
    ],
})
export class VideoModule {}
