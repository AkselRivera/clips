import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { NavComponent } from './nav/nav.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ClipsListComponent } from './clips-list/clips-list.component';
import { FbTimestampPipe } from './pipes/fb-timestamp.pipe';
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        AboutComponent,
        ClipComponent,
        NotFoundComponent,
        ClipsListComponent,
        FbTimestampPipe,
    ],
    imports: [
        BrowserModule,
        UserModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AppRoutingModule,
        AngularFireStorageModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
    constructor() {
        defineLordIconElement(lottie.loadAnimation);
    }
}
