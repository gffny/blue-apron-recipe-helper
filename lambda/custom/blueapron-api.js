const fetch = require("node-fetch");

const BLUE_APRON_SEARCH_API = 'https://www.blueapron.com/cookbook/autocomplete?term=';

module.exports = {
    searchRecipe: async function(recipeName) {
        const recipeUrl = BLUE_APRON_SEARCH_API + recipeName;
        console.log('querying the blue apron api: '+recipeUrl);
        const response = await fetch(recipeUrl);
        if (response == null) {
            console.log('response from BLUE APRON SEARCH API is null');
            throw 'response from BLUE APRON SEARCH API is null';
        }
        const json = await response.json();
        if (json == null || json.length == 0) {
            console.log('json response is null or empty');
            return null;
        }
        // filtering none recipe results;
        return json.filter(recipe => recipe != null && recipe.id != null);
    }
};