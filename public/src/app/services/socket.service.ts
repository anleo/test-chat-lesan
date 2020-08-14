import {Injectable} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	allMsgs = 'get-all-messages';
	allUsers = 'get-all-users';

	srvMsg = 'server-message';
	pubMsgs = 'public-messages';

	srvUser = 'server-user';
	pubUser = 'public-user';

	exitUser = 'exit';
	sys = 'system';

	users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	msgs$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

	constructor(private socket: Socket) {
		socket.on(this.pubUser, users => this.users$.next(users));
		socket.on(this.pubMsgs, msgs => this.msgs$.next(msgs));
	}

	sendMessage(user: string, msg: string) {
		this.socket.emit(this.srvMsg, {user, msg});
	}

	system(user, action:'join'|'left') {
		this.socket.emit(this.sys, {user, action});
	}

	getAll() {
		this.socket.emit(this.allMsgs);
		this.socket.emit(this.allUsers);
	}

	setUser(name) {
		this.socket.emit(this.srvUser, name);
	}

	exit(name) {
		this.socket.emit(this.exitUser, name);
		this.system(name, 'left');
	}
}
