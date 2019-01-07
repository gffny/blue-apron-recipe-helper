/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const BlueApron = require('./blueapron-api');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Welcome to the Blue Apron Recipe Helper! You can ask me to find you a recipe. ' +
                'For example you can say \'find me the seared cod recipe\'')
            .getResponse();
    },
};

const RH_FindRecipeIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RH_FindRecipeIntent';
    },
    async handle(handlerInput) {
        console.log('RH_FindRecipeIntentHandler::start');
        //search the blue apron api for results
        const recipeName = handlerInput.requestEnvelope.request.intent.slots.RecipeName.value;
        if (recipeName == null) {
            console.log('recipe search returns null; asking for new input');
            return handlerInput.responseBuilder
                .speak('There was issue with your input. I couldn\'t understand the recipe that you\'re looking for.')
                .reprompt('Please try again')
                .getResponse();
        }
        const recipeArray = await BlueApron.searchRecipe(recipeName);
        // if recipe is null then ask for new input
        if (recipeArray == null) {
            console.log('recipe search returns null; asking for new input');
            return handlerInput.responseBuilder
                .speak('I couldn\'t find any recipes that match ' + recipeName)
                .reprompt('Please try again')
                .getResponse();
        }
        // if recipe array has more than one recipe
        if (recipeArray.length > 1) {
            console.log('recipe search returned more than one recipe');
            var speechOutput = 'There are a number of recipes that matched your request. ';
            for (var recipeItem in recipeArray) {
                console.log('adding recipe to the response: '+recipeArray[recipeItem].label+' '+recipeArray[recipeItem].sub_label);
                speechOutput += recipeArray[recipeItem].label+' '+recipeArray[recipeItem].sub_label+'. ';
            }
            speechOutput = speechOutput.replace(/&/g, 'and')
            console.log('response: '+speechOutput);
            return handlerInput.responseBuilder
                .speak(speechOutput)
                .reprompt(speechOutput)
                .getResponse();
        }
        var speechOutput = 'Here is a recipe that matched your request. '
            + recipeArray[0].label+' '+recipeArray[0].sub_label;
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        RH_FindRecipeIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
