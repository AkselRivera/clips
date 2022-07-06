import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
    isAuth = false;

    constructor(public modal: ModalService, public auth: AuthService) {
        // DELETED SUSCRIPTION FOR DE ASYN PIPE in TEMPLATE
        // this.auth.isAuth$.subscribe( status => {
        //   this.isAuth = status
        // })
    }

    ngOnInit(): void {}

    openModal($event: Event) {
        $event.preventDefault();
        this.modal.toggleModal('auth');
    }
}
