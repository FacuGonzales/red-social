import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Publication } from '../models';
import { DeletePublicationModalComponent } from '../components/shared/delete-publication-modal/delete-publication-modal.component';

@Injectable({
    providedIn: 'root'
})

export class ModalesService {

    constructor(private modalService: MatDialog) { }

    openEliminacarPublicaicon( publication?: Publication ){
        let modalInstance = this.modalService.open( DeletePublicationModalComponent, {
            panelClass: 'modal-eliminacion',
            width: '600px',
            autoFocus: false,
            data: {
                publication,
            }
        })
        return modalInstance.afterClosed();
    }

}
