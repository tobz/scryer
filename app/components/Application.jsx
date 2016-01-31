var React = require('react')
var DebounceInput = require('react-debounce-input')
var CardBinder = require('components/CardBinder')

var Application = React.createClass({
  getInitialState: function() {
    return {cards: []}
  },
  render: function() {
    return (
      <div id="container">
        <div className="top-bar search-bar">
          <div className="top-bar-left">
            <ul className="dropdown menu">
              <li className="menu-text">Scryer</li>
            </ul>
          </div>
          <div className="top-bar-right">
            <ul className="menu">
              <li>
                <DebounceInput
                  minLength={3}
                  debounceTimeout={350}
                  onChange={this.onSearchQueryChanged}
                  id="omnibox" type="search" placeholder="Name, text, artist, etc..." />
              </li>
            </ul>
          </div>
        </div>
        <CardBinder cards={this.state.cards} />
      </div>
    )
  },
  onSearchQueryChanged: function(e) {
    var query = e.target.value
    if(query != '') {
      $.get('/search/' + encodeURIComponent(query), function(data) {
        console.log('search found ' + data.count + ' cards')
        this.setState({cards: data.cards})
      }.bind(this))
    }
  }
})

module.exports = Application
