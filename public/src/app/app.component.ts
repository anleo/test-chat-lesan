import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "./services/socket.service";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {CookieService} from "ngx-cookie-service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	user: string;

	showNameInput = true;

	userForm = {name: ''};
	form = {
		msg: '',
	};

	users$: BehaviorSubject<any[]>;
	msgs$: BehaviorSubject<any[]>;

	@ViewChild('input', {static: false}) inputEl: ElementRef;
	@ViewChild('inputName', {static: false}) inputNameEl: ElementRef;
	@ViewChild('messageWrapper', {static: false}) messageWrapper: ElementRef;

	constructor(private socket: SocketService,
	            private cook: CookieService) {
		this.socket.msgs$.subscribe(() => this.scrollBottom());
	}

	ngOnInit(): void {
		this.users$ = this.getUsers();
		this.msgs$ = this.getMessages();
		this.ensureUser();
	}

	scrollBottom() {
		if (this.messageWrapper && this.messageWrapper.nativeElement) {
			setTimeout(() => {
				this.messageWrapper.nativeElement.scrollTop = this.messageWrapper.nativeElement.scrollHeight + 30;
			}, 50);
		}
	}

	getUsers() {
		return this.socket.users$;
	}

	getMessages() {
		return this.socket.msgs$;
	}

	ensureUser() {
		this.user = this.cook.get('user');

		if (this.user) {
			this.socket.setUser(this.user);
			this.showNameInput = false;
			this.socket.getAll();
			setTimeout(() => this.scrollBottom(), 300);
			this.focus();
			return;
		}

		this.showNameInput = true;
		this.cook.delete('user');
		setTimeout(() => {
			this.focusName();
		}, 500);
	}

	setUser() {
		if (this.userForm && this.userForm.name) {
			this.socket.setUser(this.userForm.name);
			this.user = this.userForm.name;
			this.cook.set('user', this.user);
			this.userForm.name = '';
			this.showNameInput = false;
			this.socket.system(this.user, 'join');
		}
	}

	setPointing(name) {
		if (this.form.msg.includes(`@${name}`)) {
			return;
		}

		this.form.msg = `@${name} ${this.form.msg}`;
		this.focus();
	}

	sendMessage() {
		if (this.form && this.form.msg) {
			this.socket.sendMessage(this.user, this.form.msg);
			this.resetForm();
			this.focus();
		}
	}

	focus() {
		if (this.inputEl) {
			this.inputEl.nativeElement.focus();
		}
	}

	focusName() {
		if (this.inputNameEl) {
			this.inputNameEl.nativeElement.focus();
		}
	}

	resetForm() {
		this.form.msg = '';
	}

	exit() {
		this.socket.exit(this.user);
		this.user = '';
		this.cook.delete('user');
		this.showNameInput = true;

		setTimeout(() => {
			this.focusName();
		}, 500);
	}
}
