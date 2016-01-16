var React = require('react')

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
        <img className="thumbnail card" src={cardImageUrl} />
      )
    })
  }
})

module.exports = CardBinder
