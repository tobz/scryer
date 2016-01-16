var fs = require('fs-promise')
var express = require('express')
var app = express()

// Read in our data.
var cardData = fs.readJsonSync('./card-data.json')

function doesCardMatchQuery(card, query) {
  if(hasMatchingAttribute(card, 'name', query)) {
    return true
  }

  if(hasMatchingAttribute(card, 'text', query)) {
    return true
  }

  if(hasMatchingAttribute(card, 'flavor', query)) {
    return true
  }

  if(hasMatchingAttribute(card, 'artist', query)) {
    return true
  }

  return false
}

function hasMatchingAttribute(card, attr, value) {
  if(!card.hasOwnProperty(attr)) {
    return false
  }

  return card[attr].toString().toLowerCase().indexOf(value) >= 0
}

function searchCards(cardData, query) {
  console.log("querying cards for '" + query + "'")
  var matchingCards = {}

  var setCodes = Object.keys(cardData)
  for(var i = 0, il = setCodes.length; i < il; i++) {
    var setData = cardData[setCodes[i]]
    for(var j = 0, jl = setData['cards'].length; j < jl; j++) {
      // artist, flavor, name, text
      var currentCard = setData['cards'][j]
      currentCard['set'] = setCodes[i]

      if(doesCardMatchQuery(currentCard, query)) {
        console.log('found match: ' + currentCard['name'] + ' (' + currentCard['multiverseid'] + ')')

        var existingCard = matchingCards[currentCard['name']]
        if(existingCard == undefined) {
          existingCard = currentCard
        }

        if(currentCard['multiverseid'] >= existingCard['multiverseid']) {
          console.log('card is newer than previous match (' + currentCard['multiverseid'] + ' vs ' + existingCard['multiverseid'] + ')')
          matchingCards[currentCard['name']] = currentCard
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

  return flattenedMatchingCards
}

// And go.
app.use(express.static('app/public'))

app.get('/search/:query', function(request, response) {
  console.log('query: ' + request.params.query)

  var matchingCards = searchCards(cardData, request.params.query)
  response.json({count: matchingCards.length, cards: matchingCards})
})

app.listen(3000, function() {
  console.log('now listening on port 3000!')
})
