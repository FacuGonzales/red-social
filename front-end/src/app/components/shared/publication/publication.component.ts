import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Global }  from '../../../services/global';
import { UserService } from '../../../services/user.service';
import { UploadService } from '../../../services/upload.service';
import { PublicationService } from '../../../services/publication.service'
import  { Publication} from '../../../models';

@Component({
    selector: 'publication',
    templateUrl: './publication.component.html',
    styleUrls: []
})

export class PublicationComponent implements OnInit {

    @Output() enviado = new EventEmitter;
    

    publicationForms: FormGroup;

    identity;
    token;
    url;
    stats;
    publication: Publication;

    filesToUpload: Array<File>;

    constructor(private userService: UserService,
                private publicationService: PublicationService,
                private uploadService: UploadService,
                private route: ActivatedRoute,
                private router: Router,
                private alert: ToastrService) { 
                    
        this.url = Global.url;
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.stats = this.userService.getStats();
        this.publication  = new Publication('','','','', this.identity._id);
    }

    ngOnInit(): void {
        this.formInit();
    }

    formInit(){
        this.publicationForms = new FormGroup({ 
            message: new FormControl(),
        })
    }


    publicar($event){
        if(this.publicationForms.get('message').value){
            this.publication.text = this.publicationForms.get('message').value

            this.publicationService.addPublication(this.token, this.publication).subscribe(
                respuesta => {
                    if(respuesta.publication){
                        // this.publication = respuesta.publication;
                        
                        if(this.filesToUpload && this.filesToUpload.length){
                            //Subir imagen
                            this.uploadService.makeFileRequest(this.url+'upload-image-publication/'+respuesta.publication._id, [], this.filesToUpload, this.token, 'file')
                                                .then( (result: any) => {
                                                    this.publication.file = result.image
    
                                                    this.alert.success('Publicacion creada con exito');
                                                    this.publicationForms.reset();
                                                    this.router.navigate(['/home']);

                                                    this.enviado.emit({ send: 'true'});
                                                });
                        }else{
                            this.alert.success('Publicacion creada con exito');
                            this.publicationForms.reset();
                            this.router.navigate(['/home']);
                            this.enviado.emit({ send: 'true'});
                        }

                    }else{
                        this.alert.error('error al crear publicacion')
                    }
                },
                error => {
                    this.alert.error(error)
                }
            )
        }else{
            this.alert.warning('No has ingresado ninguna publicacion nueva');
        }
        
    }

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    enviarPublicacion(event){
        this.enviado.emit({ send: 'true'});
    }

}
