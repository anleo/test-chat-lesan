// server & WS initialization
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

// set DB
const loki = require('lokijs');
const db = new loki('example.db');
const users = db.addCollection('users');
const messages = db.addCollection('messages');

const allMsgs = 'get-all-messages';
const allUsers = 'get-all-users';
const srvMsgs = 'server-message';
const pubMsgs = 'public-messages';
const srvUser = 'server-user';
const pubUser = 'public-user';
const exit = 'exit';
const sys = 'system';

let userName;

io.on('connection', (socket) => {
	// set DB emmiter functions
	const emitMsgs = () => {
		const data = messages.find({}).map((msg) => {
			return {
				user: msg.user,
				msg: msg.msg,
				date: msg.date,
				action: msg.action || null
			}
		});

		socket.emit(pubMsgs, data);
	};

	const emitDb = () => {
		let data = users.find({}).map(usr => usr.name);
		io.emit(pubUser, data);
	};

	// set DB emmiters
	messages.on('insert', emitMsgs);
	// messages.on('update', emitMsgs);
	messages.on('delete', emitMsgs);
	users.on('insert', emitDb);
	// users.on('update', emitDb);
	users.on('delete', emitDb);

	// set WS handler -- messages
	socket.on(srvMsgs, (message) => {
		messages.insert({...message, date: Date.now()});
	});

	// set WS handler -- messages
	socket.on(sys, (message) => {
		messages.insert({...message, date: Date.now()});
	});

	// set WS handler -- get all messages
	socket.on(allMsgs, emitMsgs);
	socket.on(allUsers, emitDb);

	// set WS handler -- users
	socket.on(srvUser, (user) => {
		userName = user;
		const usr = users.findOne({name: user});

		if (!usr) {
			users.insert({name: user});
		}
	});

	socket.on(exit, (name) => {
		if (userName === name) {
			users.findAndRemove({name: userName});
			userName = '';
			emitDb();
		}
	});

	// remove user on disconnection (tab close)s
	socket.on('disconnect', () => {
		if (userName) {
			users.findAndRemove({name: userName});
			userName = '';
		}
	});
});

// server listener
http.listen(port, () => console.log(`listening on: ${port}`));