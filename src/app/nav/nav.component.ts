import { Component, OnInit } from '@angular/core';
import IUser from '../models/user.model';

import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
    isAuth = false;
    userData: any = { email: '', displayName: '' };

    constructor(public modal: ModalService, public auth: AuthService) {
        // console.log(this.loadUserData);
        // this.userName = userData
        // DELETED SUSCRIPTION FOR DE ASYN PIPE in TEMPLATE
        // this.auth.isAuth$.subscribe( status => {
        //   this.isAuth = status
        // })
    }

    ngOnInit(): void {
        this.getUSerInfo();
    }

    openModal($event: Event) {
        $event.preventDefault();
        this.modal.toggleModal('auth');
    }

    public async getUSerInfo() {
        this.userData = await this.auth.getUSerInfo();
        // console.log('Init', this.userData);
    }
}
