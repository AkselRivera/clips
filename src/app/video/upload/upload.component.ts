import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    AngularFireStorage,
    AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
    constructor(
        private storage: AngularFireStorage,
        private auth: AngularFireAuth,
        private clipService: ClipService,
        private router: Router
    ) {
        auth.user.subscribe((user) => (this.user = user));
    }

    alertColor = 'blue';
    alertTitle = '';
    file: File | null = null;
    inSubmission = false;
    isDragOver = false;
    loading = false;
    nextStep = false;
    percentage = 0;
    showAlert = false;
    showPercentage = false;
    user: firebase.User | null = null;
    task?: AngularFireUploadTask;

    title = new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
    });

    uploadForm = new FormGroup({
        title: this.title,
    });

    ngOnDestroy(): void {
        this.task?.cancel();
    }

    storeFile($event: Event) {
        this.isDragOver = false;
        this.file = ($event as DragEvent).dataTransfer
            ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
            : ($event.target as HTMLInputElement).files?.item(0) ?? null;

        if (!this.file || this.file.type !== 'video/mp4') return;

        this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));

        this.nextStep = true;
    }

    uploadFile() {
        this.uploadForm.disable();
        this.showAlert = true;
        this.loading = true;
        this.inSubmission = true;
        this.showPercentage = true;
        this.alertTitle = 'Please wait! Your clip is being uploaded';

        const clipFileName = uuid();
        const clipPath = `clips/${clipFileName}.mp4`;

        this.task = this.storage.upload(clipPath, this.file);
        const clipRef = this.storage.ref(clipPath);

        this.task.percentageChanges().subscribe((progress) => {
            this.percentage = (progress as number) / 100;
        });

        this.task
            .snapshotChanges()
            .pipe(
                last(),
                switchMap(() => clipRef.getDownloadURL())
            )
            .subscribe({
                next: async (url) => {
                    const clip = {
                        uid: this.user?.uid as string,
                        displayName: this.user?.displayName as string,
                        photoUrl: this.user?.photoURL as string,
                        title: this.title.value,
                        fileName: `${clipFileName}.mp4`,
                        url,
                        timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                    };

                    const clipDocRef = await this.clipService.createClip(clip);

                    this.alertColor = 'green';
                    this.alertTitle =
                        'Success! Your clip is now ready to share with the world';
                    this.showPercentage = false;

                    setTimeout(() => {
                        this.router.navigate(['clip', clipDocRef.id]);
                    }, 1500);
                },
                error: (error) => {
                    this.uploadForm.enable();
                    this.alertColor = 'red';
                    this.alertTitle = 'Upload failed! Please try again later.';
                    this.showPercentage = false;
                    this.inSubmission = false;
                },
            });
    }
}
