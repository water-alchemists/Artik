'use strict';
const fs = require('fs');

function readFile(path){
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if(err) return reject(err);
			resolve(data);
		})
	});
}

function writeFile(path, data){
	return new Promise((resolve, reject) => {
		fs.writeFile(path, `${data}`, (err, data) => {
			if(err) return reject(err);
			resolve(data);
		});
	});
}

function appendFile(path, data){
	return new Promise((resolve, reject) => {
		fs.appendFile(path, `${data}`, (err, data) => {
			if(err) return reject(err);
			resolve(data);
		});
	});
}

function delay(ms){
	return new Promise((resolve, reject) => {
		let id;

		function settingTimeout(){ 
			id = setTimeout(() => clearingTimeout(), ms); 
		}

		function clearingTimeout(){
			clearTimeout(id);
			resolve();
		}

		try {
			settingTimeout();
		} catch (e) {
			reject(e);
		}
	});
}

function polling(ms, retries, action){
	if(!retries) retries = 5;
	return new Promise((resolve, reject) => {
		if(!retries--) throw new Error('Too many retries');
		return action()
			.then(data => {
				return delay(ms).then(() => action(data));
			})
			.catch(err => {
				return polling(ms, retries, action);
			})
	});
}

module.exports = {
	readFile,
	writeFile,
	appendFile,
	delay,
	polling,
}