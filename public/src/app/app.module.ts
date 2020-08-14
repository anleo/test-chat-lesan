import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {SocketService} from "./services/socket.service";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}};

const ui = [
	MatFormFieldModule,
	MatInputModule,
	MatButtonModule,
	MatIconModule,
	MatTooltipModule
];

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		...ui,
		FormsModule,
		BrowserModule,
		SocketIoModule.forRoot(config),
		BrowserAnimationsModule
	],
	providers: [SocketService, CookieService],
	bootstrap: [AppComponent]
})
export class AppModule {
}
