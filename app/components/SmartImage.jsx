var React = require('react')
var debounce = require('debounce')
var Verge = require('verge')

var addEvent = (function() {
    if(document.addEventListener) {
        return function addStandardEventListener(el, eventName, fn) {
            return el.addEventListener(eventName, fn, false)
        }
    } else {
        return function addIEEventListener(el, eventName, fn) {
            return el.attachEvent('on' + eventName, fn)
        }
    }
})()

var removeEvent = (function() {
    if(document.addEventListener) {
        return function removeStandardEventListener(el, eventName, fn) {
            return el.removeEventListener(eventName, fn, false)
        }
    } else {
        return function removeIEEventListener(el, eventName, fn) {
            return el.detachEvent('on' + eventName, fn)
        }
    }
})()

var SmartImage = React.createClass({
    getDefaultProps: function() {
        return {
            onLoad: function() { console.log('loaded') },
            onError: function() { console.log('error trying to load image') },
            lazyOffset: 0,
            placeholderSrc: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7'
        }
    },
    getInitialState: function() {
        this.onViewportChange = debounce(this.onViewportChange, 150)

        return {}
    },
    componentDidMount: function() {
        if(this.props.lazy) {
            this.onViewportChange()
            addEvent(window, "scroll", this.onViewportChange)
            addEvent(window, "resize", this.onViewportChange)
        }
    },
    componentWillUnmount: function() {
        if(this.props.lazy) {
            removeEvent(window, "scroll", this.onViewportChange)
            removeEvent(window, "resize", this.onViewportChange)
        }
    },
    render: function() {
        if(this.props.lazy && !this.state.lazyloaded) {
            return this.renderPlaceholder()
        }

        return (
            <img {...this.props} src={this.props.url} />
        )
    },
    renderPlaceholder: function() {
        return (
            <img ref="placeholder" {...this.props} src={this.props.placeholderSrc} />
        )
    },
    onViewportChange: function() {
        if(this.refs.placeholder && Verge.inViewport(this.refs.placeholder, this.props.lazyOffset)) {
            this.setState({ lazyloaded: true })
        }
    }
})

module.exports = SmartImage
