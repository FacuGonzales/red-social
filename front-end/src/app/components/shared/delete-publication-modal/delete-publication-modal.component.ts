import { Component, OnInit, Inject } from '@angular/core';
import { Publication } from '../../../models';
import { PublicationService } from 'src/app/services/publication.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'app-delete-publication-modal',
    templateUrl: './delete-publication-modal.component.html',
    styleUrls: []
})

export class DeletePublicationModalComponent implements OnInit {
    token;
    publication: Publication;

    constructor( private publicationData: PublicationService,
                 private alert: ToastrService,
                 private userService: UserService,
                 public dialogRef: MatDialogRef<DeletePublicationModalComponent>,
                 @Inject(MAT_DIALOG_DATA) public data) { 
        this.token = this.userService.getToken()
    }


    ngOnInit(): void {
        if( this.data.publication){
            this.publication = this.data.publication
        }
    }
  
    cancel() {
        this.dialogRef.close(false);
    }  

    confirmar(){
        this.publicationData.deletePublication(this.token, this.publication._id).subscribe( 
            respuesta =>{
                this.alert.success('Publicacion eliminada correctamente.');
                this.dialogRef.close(true);
            },
            error => {
                this.alert.error(error)
            }
        );
    }
  

}







