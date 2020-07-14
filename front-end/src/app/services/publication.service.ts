import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable' 
import { Global } from './global';
import { Publication } from '../models';

@Injectable({
    providedIn: 'root'
})

export class PublicationService {
    url: string;
    identity;
    token;

    constructor( public http: HttpClient) {
        this.url = Global.url;
    }

    addPublication(token, publication):Observable<any>{
        let params = JSON.stringify(publication);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this.http.post(this.url+'publication', params, {headers: headers});
    }

    getPublicationUser(token, user_id, page = 1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this.http.get(this.url+'publications-user/'+ user_id + '/' + page, {headers: headers});
    }

    getPublication(token, page = 1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this.http.get(this.url+'publications/'+page, {headers: headers});
    }

    deletePublication(token, idPublication):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this.http.delete(this.url+'publication/'+idPublication, {headers: headers});
    }
}
