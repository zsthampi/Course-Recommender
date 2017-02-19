// Reference : https://www.npmjs.com/package/piazza-api

var P = require('piazza-api');
var async = require('async');

var cscHelp;
// A dictionary of lists
var data = {};
// List to store folders (Which are the Courses)
var folders = [];

var promise1 = new Promise(function(resolve,reject) {
	P.login('zsthampi@ncsu.edu', 'piazza').then(function(user) {
	// Get the class
	cscHelp = user.getClassByID('iz1fzsfax226lo');

	// Iterate through each Course - which are folders in the Piazza class
	cscHelp.folders.forEach(function(folder) {
		data[folder] = [];
		folders.push(folder);
	// console.log(data);
	// Get the contents of each folder 
	});
	resolve();
	});
});

var promise2 = new Promise(function(resolve,reject) {
	var promise_array = [];
	promise1.then(function() {
		folders.forEach(function(folder) {
			promise_array.push(new Promise(function(resolve,reject) {
				cscHelp.filterByFolder(folder).then(function(feedItems) {
					data[folder] = feedItems.reverse();
					resolve();
				});
			}));
		});
		Promise.all(promise_array).then(function() {
			resolve();
		});
	});
});

var promise3 = new Promise(function(resolve,reject) {
	var promise_array = [];
	promise2.then(function() {
		folders.forEach(function(folder) {
			data[folder].forEach(function(feedItem,index) {
				// var feedItem_to_content;
				promise_array.push(new Promise(function(resolve,reject) {
					feedItem.toContent().then(function(content) {
						data[folder][index] = content;
						resolve();
					});
				}));
				// return feedItem_to_content;
			});
		});
		Promise.all(promise_array).then(function() {
			resolve();
		});
	});
});

promise3.then(function() {
	folders.forEach(function(folder) {
		var contents = []
		data[folder].forEach(function(content) {
			contents.push(content.title+content.content);
			// console.log(data[folder]);
			try {
				contents.push(content.instructorResponse.content);
			} catch(err) {}
			try {
				contents.push(content.studentResponse.content);
			} catch(err) {}
			content.followups.forEach(function(followup) {
				contents.push(followup.subject);
				followup.children.forEach(function(comment) {
					contents.push(comment.subject);
				});
			});
		});
		data[folder] = contents;
	});
	console.log(JSON.stringify(data));
});