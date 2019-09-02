const readline = require("readline");

const users = require("./users.json"); // Note: This will cache the JSON file for future 'require's
const venues = require("./venues.json"); // As will this.

const funcs = require("./funcs.js"); // Import classes and functions that have been split out to allow writing of tests
const User = funcs.User;
const determineBestVenuesForParty = funcs.determineBestVenuesForParty;
const getUserFromJSONByName = funcs.getUserFromJSONByName;

// Set up console read/write object
const userInterface = readline.createInterface(
{
	input: process.stdin,
	output: process.stdout
});

// Begin reading names from the console (this kicks off the whole thing)
readUserNameFromConsole([]);

// Read a name from the user via the console. This adds the JSON data for the named
// user to the party array and calls itself again so that the user can add another
// name. If the user enters an empty string then the function to do the calculation
// regarding which venues are suitable is called, and its results output to the
// console via outputAssessmentToConsole().
function readUserNameFromConsole(party)
{
	const prompt = "Please enter a party member's name (blank line to end):";

	// Read in typed input from the user.
	userInterface.question(prompt, (name) => 
	{
		if(name == "")
		{
			// Blank line entered, so close the interface and determine venues for
			// this party.
			userInterface.close();
			const venueAssessment = determineBestVenuesForParty(party, venues);
			console.log(JSON.stringify(venueAssessment));
			outputAssessmentToConsole(venueAssessment);
		}
		else 
		{
			const userData = getUserFromJSONByName(name, users);
			if(typeof userData === "undefined")
			{
				console.log("Sorry, user '" + name + "'' was not found in the list.");
			}
			else
			{
				party.push(new User(userData));
				console.log("Found user '" + name + "'!");
			}

			readUserNameFromConsole(party);
		}
	});
}

// Function to take two lists (as returned by determineBestVenuesForParty) and output them
// reasonably nicely to the console.
function outputAssessmentToConsole({ placesToGo, placesToAvoid })
{
	console.log("\n\nPlaces to go:\n");
	placesToGo.forEach(venue => console.log(venue));
	console.log("\nPlaces to avoid:\n");
	placesToAvoid.forEach(venue =>
	{
		console.log(venue.name)
		venue.reasons.forEach(reason => 
		{
			console.log(" • " + reason);
		});
	});
	console.log("\n");	
}




