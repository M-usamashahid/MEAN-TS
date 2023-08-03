import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { HelperService } from './helper.service';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';

/**
 * Generic Socket Service
 */
@Injectable()
export class SocketService {
    private socket: any;
    private token: any;
    /**
     * @param  {CookieService} CookieService Cookie Service
     */
    constructor(private helperService: HelperService) {
        this.socketConnect();
    }

    socketConnect() {
        this.token = this.helperService.getClientToken();
        const config: any = {
            'query': `token=${this.token}`,
            transports: ['websocket'],
            forceNew: false,
            secure: true,
        };
        this.socket = io.connect(`${environment.socket_url}`, config);

        console.log('-----------------------------------');
        console.log(this.socket);
        this.socket.on('error', (error: any) => this.socketDisconnect());
    }

    /**
     * ==============================
     *             Socket
     * ==============================
     */

    /**
    * @param  {string} event Event name
    * @param  {object} data Data Object
    * @returns {void}
    */
    public socketEmit = (event: any, data: any, ack?: any) => this.socket.emit(event, data, ack);

    /**
     * @param  {string} event Event name
     * @returns {Observable} Data Observable
     */
    public socketOn(event: any): Observable<any> {
        return new Observable((observer) => this.socket.on(event, (data: any, ack?: any) => {
            // console.log(data);
            observer.next(data);
            const user = this.helperService.jwtDecode(this.token);
            // const signature = `${this.socket.id}-${new Date().toString()}-${user._id}-${user.firstName}`;
            // ack(true);
        }));
    }

    public removeListener = (event: any, fn?: any) => this.socket.removeListener(event);

    public socketDisconnect = () => this.socket.disconnect();

}
