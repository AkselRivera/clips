import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    OnChanges,
    Output,
    EventEmitter,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clip.models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
    @Input() activeClip: IClip | null = null;
    @Output() update = new EventEmitter();

    constructor(
        private modal: ModalService,
        private clipService: ClipService
    ) {}

    inSubmission = false;
    showAlert = false;
    alertColor = '';
    alertTitle = '';

    clipID = new FormControl('', { nonNullable: true });
    title = new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
    });

    editForm = new FormGroup({
        title: this.title,
    });

    ngOnInit(): void {
        this.modal.register('editClip');
    }

    ngOnChanges(): void {
        if (!this.activeClip) return;

        this.inSubmission = false;
        this.showAlert = false;

        this.clipID.setValue(this.activeClip.docID as string);
        this.title.setValue(this.activeClip.title);
    }

    ngOnDestroy(): void {
        this.modal.unregister('editClip');
    }

    submit() {
        if (!this.activeClip) return;
        this.inSubmission = true;
        this.showAlert = true;
        this.alertColor = 'blue';
        this.alertTitle = 'Please wait! Updating clip.';

        try {
            this.clipService.updateClip(this.clipID.value, this.title.value);
        } catch (error) {
            this.inSubmission = false;
            this.alertColor = 'red';
            this.alertTitle = 'Something went wrong! Please try again later.';
            return;
        }
        this.activeClip.title = this.title.value;
        this.update.emit(this.activeClip);

        this.inSubmission = false;
        this.alertColor = 'green';
        this.alertTitle = 'Clip successfully updated!';

        setTimeout(() => {
            this.inSubmission = false;
            this.showAlert = false;
        }, 2500);
    }
}
