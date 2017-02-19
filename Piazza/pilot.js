// Reference : https://www.npmjs.com/package/piazza-api

var P = require('piazza-api');
P.login('zsthampi@ncsu.edu', 'piazza').then(function(user) {
	// Fields for user
	// id [String] - a unique id for each user
	// name [String] - the name of the user
	// email [String] - the email address of the user
	// roles [Object] - maps IDs of the user's classes to the role (for example: 'student', 'professor')
	// classIds [Array] - an array containing the string IDs of the user's enrolled classes
	// classes [Array] - an array of Class objects the user is enrolled in
	// lastSeenClass [Class] - the most recent Class the user has looked at

	// // FIND THE FIELDS/FUNCTIONS INSIDE USER CLASS
	// function getAllMethods(object) {
	// return Object.getOwnPropertyNames(object).filter(function(property) {
	// 	// return typeof object[property] == 'function';
	// 	return property;
	// });
	// }
	// console.log(getAllMethods(user));

	// Fields for class
	// id [String] - a unique id for each class
	// name [String] - the name of the class
	// courseNumber [String] - the course number associated with the class (for example: 6.01 or CS101)
	// courseDescription [String] - a short description of the class
	// department [String] - the department the class belongs to
	// school [School] - the school the class belongs to
	// status [String] - status of the course (for example: 'inactive' or 'active')
	// term [String] - what term the class the active (for example: 'Fall 2014')
	// startDate [String] - date the class starts
	// endDate [String] - date the class ends
	// totalPosts [Integer] - total number of posts visible to instructors
	// totalPublicPosts [Integer] - total number of posts visible to students only
	// folders [Array] - an array of folder names as Strings
	// instructors [Array] - an array of Objects containing the names and emails of class instructors

	// // FIND THE FIELDS/FUNCTIONS INSIDE PIAZZA CLASS
	// function getAllMethods(object) {
	// return Object.getOwnPropertyNames(object).filter(function(property) {
	// 	// return typeof object[property] == 'function';
	// 	return property;
	// });
	// }
	// console.log(getAllMethods(P));

	// console.log(user.id);
	// console.log(user.name);
	// console.log(user.email);
	// console.log(user.roles);
	// console.log(user.classIds);
	// console.log(user.classes);
	// console.log(user.lastSeenClass);

	// // FIND THE FIELDS/FUNCTIONS INSIDE CLASS CLASS
	// function getAllMethods(object) {
	// return Object.getOwnPropertyNames(object).filter(function(property) {
	// 	// return typeof object[property] == 'function';
	// 	return property;
	// });
	// }
	// console.log(getAllMethods(user.classes[0]));

	// // ACCESS METHODS FOR A SINGLE CLASS
	// user.classes[0].getStats().then(function(stat) {
	// 	console.log(stat);
	// }).catch(function(error) {
	// 	console.log("OOPS! : ",error);
	// });
	// user.classes[0].getOnlineUsersCount().then(function(count) {
	// 	console.log(count);
	// }).catch(function(error) {
	// 	console.log("OOPS! : ",error);
	// });

	// // Iterate through all the classes
	// user.classes.forEach(function(oneClass) {
	// 	console.log(oneClass.name);
	// 	// Iterate through all the folders 
	// 	oneClass.folders.forEach(function(folder) {
	// 		// console.log(folder);
	// 		oneClass.filterByFolder(folder).then(function(content) {
	// 			console.log(content);
	// 		}).catch(function(error) {
	// 			console.log("OOPS! : ",error);
	// 		});
	// 	})

	// 	// // Get contents using ID for each class
	// 	// oneClass.getContentByID(8).then(function(content) {
	// 	// 	console.log(content);
	// 	// }).catch(function(error) {
	// 	// 	console.log("OOPS! : ",error);
	// 	// })

	// });

	var oneClass = user.classes[1]
	var folder = "quiz4"
	console.log(oneClass.name,folder);
	oneClass.filterByFolder(folder).then(function(feedItems) {
		feedItems.forEach(function(feedItem) {
			feedItem.toContent().then(function(content) {
				console.log(content.title,content.content);
				console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
				try {
					console.log(content.instructorResponse.content);
					console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
				} catch(err) {
					console.log("!!!ERROR!!!");
				}
				try {
					console.log(content.studentResponse.content);
					console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
				} catch(err) {
					console.log("!!!ERROR!!!");
				}	
				content.followups.forEach(function(followup) {
					console.log(followup.subject);
					console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
					followup.children.forEach(function(comment) {
						console.log(comment.subject);
						console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
					});
				});
				// console.log(content);
			}).catch(function(error) {
				console.log("OOPS! : ",error);
			})
		})
	}).catch(function(error) {
		console.log("OOPS! : ",error);
	});

});

console.log('Hello World!');