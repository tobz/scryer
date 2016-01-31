var fs = require('fs-promise')
var winston = require('winston')
var moment = require('moment')
var firstBy = require('thenby')
var express = require('express')
var app = express()

// Set up our logging.
winston.loggers.add('scryer', {
  console: {
    colorize: true,
    timestamp: function() {
      return moment().format()
    }
  }
});

var logging = winston.loggers.get('scryer')

// Read in our data.
var cardData = fs.readJsonSync('./card-data.json')

function attemptCardMatch(card, query) {
  var matches = false

  if(hasMatchingAttribute(card, 'artist', query)) {
    matches = true
    card['match_factor'] = 600
  }

  if(hasMatchingAttribute(card, 'flavor', query)) {
    matches = true
    card['match_factor'] = 700
  }

  if(hasMatchingAttribute(card, 'text', query)) {
    matches = true
    card['match_factor'] = 800
  }

  if(hasMatchingAttribute(card, 'name', query)) {
    matches = true

    // If we have a name match, see if it's the full name.
    if(card['name'].toLowerCase() == query.toLowerCase()) {
      card['match_factor'] = 1000
    } else {
      card['match_factor'] = 900
    }
  }

  return {card: card, matches: matches}
}

function hasMatchingAttribute(card, attr, value) {
  if(!card.hasOwnProperty(attr)) {
    return false
  }

  return card[attr].toString().toLowerCase().indexOf(value) >= 0
}

function sortedCards(cards) {
  return cards.sort(firstBy('match_factor', -1).thenBy('name'))
}

function searchCards(cardData, query) {
  var matchingCards = {}

  var setCodes = Object.keys(cardData)
  for(var i = 0, il = setCodes.length; i < il; i++) {
    var setData = cardData[setCodes[i]]
    for(var j = 0, jl = setData['cards'].length; j < jl; j++) {
      // artist, flavor, name, text
      var currentCard = setData['cards'][j]
      currentCard['set'] = setCodes[i]

      var matchData = attemptCardMatch(currentCard, query)
      if(matchData['matches']) {
        var matchedCard = matchData['card']
        var existingCard = matchingCards[matchedCard['name']]
        if(existingCard == undefined) {
          existingCard = matchedCard
        }

        if(matchedCard['multiverseid'] >= existingCard['multiverseid']) {
          matchingCards[matchedCard['name']] = matchedCard
        }
      }
    }
  }

  var flattenedMatchingCards = []
  var matchingCardNames = Object.keys(matchingCards)
  for(var i = 0, il = matchingCardNames.length; i < il; i++) {
    var actualCard = matchingCards[matchingCardNames[i]]
    flattenedMatchingCards.push(actualCard)
  }

  return sortedCards(flattenedMatchingCards)
}

// And go.
app.use(express.static('app/public'))

app.get('/search/:query', function(request, response) {
  logging.log('info', 'Query request: %s', request.params.query)

  var startTime = Date.now()
  var matchingCards = searchCards(cardData, request.params.query)
  var delta = Date.now() - startTime

  logging.log('info', 'Search took %dms to execute, returning %s matches.', delta, matchingCards.length)

  response.json({count: matchingCards.length, cards: matchingCards})
})

logging.info('Listening for requests on port 3000!')
app.listen(3000)
