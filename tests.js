const users = require("./users.json"); // Note: This will cache the JSON file for future 'require's
const venues = require("./venues.json"); // As will this.

const funcs = require("./funcs.js"); // Import classes and functions that have been split out to allow testing of main logic
const User = funcs.User;
const determineBestVenuesForParty = funcs.determineBestVenuesForParty;
const getUserFromJSONByName = funcs.getUserFromJSONByName;


const tests = [];

// All tests defined here and added to 'tests' array
// Note: would be nice to write some tests using some different data sets, e.g. simplified
// ones, but I have run out of time! The framework here allows for it though, as you can
// pass in any data you like.

// Test 0: User class, willEat function
tests.push( function()
{
	const user = new User(getUserFromJSONByName("Alan Allen", users));

	const output = user.willEat("MEAT");
	const correctOutput = false;

	return output === correctOutput;
});


// Test 1: User.willEat
tests.push( function()
{
	const user = new User(getUserFromJSONByName("Alan Allen", users));

	const output = user.willEat("meaty");
	const correctOutput = true;

	return output === correctOutput;
});


// Test 2: User.willDrink
tests.push( function()
{
	const user = new User(getUserFromJSONByName("Alan Allen", users));

	const output = user.willDrink("meaty");
	const correctOutput = false;

	return output === correctOutput;
});


// Test 3: User.willDrink
tests.push( function()
{
	const user = new User(getUserFromJSONByName("Alan Allen", users));

	const output = user.willDrink("tea");
	const correctOutput = true;

	return output === correctOutput;
});

// Test 4: full logic with single user
tests.push( function()
{
	const partyNames = [ "David Lang" ];
	const party = getPartyDataFromNames(partyNames);

	const output = determineBestVenuesForParty(party, venues);
	const correctOutput = { 
		"placesToGo": [ 
			"El Cantina",
			"Spice of life",
			"The Cambridge",
			"Wagamama",
			"Sultan Sofrasi",
			"Spirit House",
			"Tally Joe" ],
		"placesToAvoid": [
			{"name":"Twin Dynasty","reasons":["There is nothing for David Lang to eat"]},
			{"name":"Fabrique","reasons":["There is nothing for David Lang to drink"]} ]
	};

	return JSON.stringify(output) === JSON.stringify(correctOutput);
});

// Test 5: full logic with many users
tests.push( function()
{
	const partyNames = [ "John Davis", "Robert Webb", "David Lang", "Gavin Coulson", "Alan Allen" ];
	const party = getPartyDataFromNames(partyNames);

	const output = determineBestVenuesForParty(party, venues);
	const correctOutput = {
		"placesToGo": [
			"Spice of life",
			"The Cambridge" ],
		"placesToAvoid": [
			{"name":"El Cantina","reasons":["There is nothing for Robert Webb to drink"]},
			{"name":"Twin Dynasty","reasons":["There is nothing for David Lang to eat"]},
			{"name":"Wagamama","reasons":["There is nothing for Robert Webb to drink"]},
			{"name":"Sultan Sofrasi","reasons":["There is nothing for Robert Webb to drink"]},
			{"name":"Spirit House","reasons":["There is nothing for Alan Allen to drink"]},
			{"name":"Tally Joe","reasons":["There is nothing for Robert Webb to drink"]},
			{"name":"Fabrique","reasons":["There is nothing for Robert Webb to drink","There is nothing for David Lang to drink"]} ]
		};

	return JSON.stringify(output) === JSON.stringify(correctOutput);
});




// Run all the tests
let allPass = true;
tests.forEach((test, index) =>
{
	let pass = false;
	let errorMessage = "";
	try 
	{
		pass = test();
	}
	catch(err)
	{
		errorMessage = err.message;
	}
	
	if(pass)
	{
		console.log("Test "+index+" passed.");
	}
	else
	{
		console.log("Test "+index+" failed!");
		if(errorMessage)
			console.log("Error message: ", errorMessage);
	}

	allPass = allPass && pass;
});

if(allPass)
	console.log("All tests passed successfully!");


function getPartyDataFromNames(names)
{
	return names.map(name => new User(getUserFromJSONByName(name, users)));
}