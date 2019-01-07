const BlueApron = require('./blueapron-api');

async function testBlueApronAPI() {
    var recipeResponse = await BlueApron.searchRecipe('seared cod');
    var speechOutput = '';
    for (var recipeItem in recipeResponse) {
        speechOutput += recipeResponse[recipeItem].label+' '+recipeResponse[recipeItem].sub_label+'. ';
        console.log(recipeResponse[recipeItem].label);
    }
    console.log('recipeResponse[1].label: '+recipeResponse[1].label);

}

testBlueApronAPI();