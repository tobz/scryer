# scryer

a supah-dupah fast search interface for Magic the Gathering cards

# the basics

Cards have a lot of information on:

- name
- color(s)
- converted mana cost
- card type
- text
- flavor text
- card set
- power/toughness
- etc

What if you could easily search based on any of that?  Looking for any card with Convoke? Easy.  Looking through all legendary creatures to find a commander to fit your EDH deck idea? Easy.  Maybe you wanna find all the slivers, or see which cards can generate a 20/20 token, or just look through all the cards in a set.... easy.

You type into a search box with any of those terms, and we find all the cards that match.  Quickly.  Most searches return in less than 100ms.

# todo

- hover-over information for cards (currently, you just get the card image)
- better sorting (do we show the most recent cards first? or the ones with the term in the name? etc)
- better UI interactions (lazy load images in batches to avoid rendering the whole DOM at once)
