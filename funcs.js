// Class to handle users' data and neatly provide functions to determine whether a user
// will eat or drink something.
exports.User = class 
{
	// Constructor expects object with name, wont_eat (array of names), and drinks (array
	// of names) variables.
	constructor(jsonData)
	{
		this.name = jsonData.name;
		this.wontEat = jsonData.wont_eat;
		this.drinks = jsonData.drinks;
	}

	// Case-insensitive check whether this user will eat the specified food
	willEat(food)
	{
		const lowerCaseFood = food.toLowerCase();
		for(let forbiddenFruit of this.wontEat)
		{
			if(lowerCaseFood === forbiddenFruit.toLowerCase())
				return false;
		}

		return true;
	}

	// Case-insensitive check whether this user will drink the specified drink
	willDrink(drink)
	{
		const lowerCaseDrink = drink.toLowerCase();
		for(let tipple of this.drinks)
		{
			if(lowerCaseDrink === tipple.toLowerCase())
				return true;
		}

		return false;
	}
}

// Function that calculates which of the specified venues are acceptable (and
// unacceptable) for the specified party. Returns a list of names of acceptable venues
// and a list of unacceptable ones, with reasons why each is not ok.
exports.determineBestVenuesForParty = function(party, venues)
{
	let placesToGo = [];
	let placesToAvoid = [];

	// Loop through each venue to determine whether it's suitable
	for(let venue of venues)
	{
		let venueAcceptable = true; // Say venue is ok for now, if we find it's not, set to false
		const reasons = []; // Here we will store any reasons why this venue is not ok

		// Loop through each person in the party and see whether this venue is ok for them
		for(member of party)
		{
			// Check each cuisine at this venue and whether this person will eat it
			let acceptableCuisine = false;
			for(let food of venue.food)
			{
				if(member.willEat(food))
					acceptableCuisine = true; // There's at least one thing this person will eat
			}

			if(!acceptableCuisine)
			{
				// Nothing this person is willing to eat, so venue is not ok, store reason why
				venueAcceptable = false;
				reasons.push("There is nothing for " + member.name + " to eat");
			}

			// Check beverages at the venue and
			let acceptableBeverage = false;
			for(let drink of venue.drinks)
			{
				if(member.willDrink(drink))
					acceptableBeverage = true; // At least one drink this user will drink, so ok
			}

			if(!acceptableBeverage)
			{
				// Nothing this person is willing to drink, so venue is not ok, store reason why
				venueAcceptable = false;
				reasons.push("There is nothing for " + member.name + " to drink");
			}

		}

		// Add to list of ok venues if no one vetoed it, otherwise add to list of venues
		// to avoid and store all the reasons why.
		if(venueAcceptable)
		{
			placesToGo.push(venue.name);
		}
		else
		{
			placesToAvoid.push({name: venue.name, reasons: reasons});
		}
	}

	// Return the lists of places to go and not to go
	return { placesToGo, placesToAvoid };
}

// Simple helper function to retrieve a specific user's data from the JSON data by name
exports.getUserFromJSONByName = function(name, usersJSON)
{
	const lowerCaseName = name.toLowerCase();
	return usersJSON.filter( user => user.name.toLowerCase() === lowerCaseName ).pop();
}


