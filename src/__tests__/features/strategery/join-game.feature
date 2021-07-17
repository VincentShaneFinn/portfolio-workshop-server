Feature: Join Game

    support players joining the game

    Scenario: Can add one player to the game
        When Player 1 is added to the game
        Then Player 1 is in the list of players

    Scenario: First Player to join is the host
        When Player 1 is added to the game
        Then Player 1 is the host

    Scenario: Can add multiple players
        When Player 1 is added to the game
        And Player 2 is added to the game
        Then Player 2 is in the list of players
        And there are 2 players

    Scenario: Can remove player from the game
        When Player 1 is added to the game
        And Player 1 is removed from the game
        Then Player 1 is not in the list of players

    Scenario: Promote next player to host when current host leaves
        Given players in the game
        When the host is removed from the game
        Then the next player is promoted to host;

    Scenario: Clear host when all players have left
        Given players in the game
        When All players are removed from the game
        Then the host is cleared

    Scenario: Call domain event when the list of players changes
        When Player 1 is added to the game
        Then players-changed domain event is called 
        When Player 1 is removed from the game
        Then players-changed domain event is called again

    Scenario: Call domain event when the host changes
        When Host Player is added to the game
        Then host-changed event is called
        When Host Player is removed from the game
        Then host-changed event is fired again

    Scenario: Call domain event when all players disconnected fires a special
        When Player 1 is added to the game
        And Player 1 is removed from the game
        When all-disconnected event is called
