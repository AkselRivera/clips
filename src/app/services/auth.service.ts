import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { delay, map, filter, switchMap } from 'rxjs/operators';

import IUser from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userCollection: AngularFirestoreCollection<IUser>;
    public isAuth$: Observable<boolean>;
    public isAuthWithDelay$: Observable<boolean>;
    private redirect = false;

    constructor(
        private auth: AngularFireAuth,
        private db: AngularFirestore,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.userCollection = db.collection('users');
        this.isAuth$ = auth.user.pipe(map((user) => !!user));
        this.isAuthWithDelay$ = this.isAuth$.pipe(delay(1200));

        this.router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                map((e) => this.route.firstChild),
                switchMap((route) => route?.data ?? of({}))
            )
            .subscribe((data) => {
                this.redirect = data['authOnly'] ?? false;
            });
    }

    public async createUser(userData: IUser) {
        if (!userData.password) throw new Error('Password not provided!');

        const userCredential = await this.auth.createUserWithEmailAndPassword(
            userData.email as string,
            userData.password as string
        );

        if (!userCredential.user) throw new Error('No user found');

        this.userCollection.doc(userCredential.user.uid).set({
            name: userData.name,
            email: userData.email,
            age: userData.age,
            phoneNumber: userData.phoneNumber,
        });

        await userCredential.user.updateProfile({
            displayName: userData.name,
        });
    }

    public async logOut($event?: Event) {
        if ($event) {
            $event.preventDefault();
        }

        if (this.redirect) {
            await this.router.navigateByUrl('/');
        }
        await this.auth.signOut();
    }
}
