import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable' 
import { Global } from './global';
import { Message } from '../models';

@Injectable({
    providedIn: 'root'
})

export class MessageService {
    url: string;

    constructor(private http: HttpClient) {
        this.url = Global.url;
    }
    
    addMessage(token, message):Observable<any>{
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                      .set('Authorization', token);

        return this.http.post(this.url+'new-message', params, {headers: headers} );
    }

    getMyMessages(token, page = 1):Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                      .set('Authorization', token);

        return this.http.get(this.url+'messages-receiver/'+page, {headers: headers} );
    }

    getMyEmitMessages(token, page = 1):Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                      .set('Authorization', token);

        return this.http.get(this.url+'messages-emit/'+page, {headers: headers} );
    }

}
