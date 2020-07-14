import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service'
import { Global } from '../../services/global';
import { ModalesService } from '../../services/modales.service';
import { Publication } from '../../models'


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: []
})
export class HomeComponent implements OnInit {
    identity;
    token;
    url;
    page;
    total;
    pages;
    itemsPerPage;
    publications: Publication[];
    showImage;
    noMore= false;


    constructor( private userService: UserService,
                 private publicationService: PublicationService,
                 private modalesService: ModalesService,
                 private alert: ToastrService,
                 private route: ActivatedRoute,
                 private router: Router) { 
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = Global.url;
        this.page = 1;
      
    }

    ngOnInit(): void {
        this.getPublication(this.page);
    }

    getPublication(page, adding=false){
        this.publicationService.getPublication(this.token, page).subscribe(
            respuesta => {
                if(respuesta.publications){
                    this.itemsPerPage = respuesta.itemsPerPage;
                    this.total = respuesta.total_items;
                    this.pages = respuesta.pages;

                    if(!adding){
                        
                        this.publications = respuesta.publications;
                    }else{
                        var arrayA = this.publications;
                        var arrayB = respuesta.publications;
                        this.publications = arrayA.concat(arrayB);
                    }
                }else{
                    this.alert.error('error al obtener publicaciones')
                }
                
            },
            error => {
                this.alert.error(error)
            }
        )
    }

    viewMore(){
        this.page += 1
        if(this.page == this.pages){
            this.noMore = true;
        }else{
            this.page += 1;
        }

        this.getPublication(this.page, true)
    }

    refresh(event){
        this.getPublication(1);
    }

    actualizarListado(){
        this.getPublication(1);
    }

    showImg(id){
        this.showImage = id;
    }

    hiddenImg(){
        this.showImage = null
    }

    deletePublication(publication){
        this.modalesService.openEliminacarPublicaicon(publication).subscribe( respuesta => {
            if (respuesta) {
                this.getPublication(1);
            }
        });
    }
}
