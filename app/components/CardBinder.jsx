var React = require('react')
var SmartImage = require('components/SmartImage')

var CardBinder = React.createClass({
  render: function() {
    return (
      <div className="row">
        {this.getCards()}
      </div>
    )
  },
  getCards: function() {
    return this.props.cards.map(function(card) {
      var cardImageUrl = 'http://magiccards.info/scans/en/' + card.set.toLowerCase() + '/' + card.number + '.jpg'
      return (
        <SmartImage
          url={cardImageUrl}
          className="thumbnail card"
          height={302} width={212}
          lazy={true} lazyOffset={500} />
      )
    })
  }
})

module.exports = CardBinder
