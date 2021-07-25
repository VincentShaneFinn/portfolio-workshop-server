Feature: Tic-Tac-Toe

Scenario: 2 players
    Given a tic-tac-toe game
    When two players join the game
    Then current player is the first to join

Scenario: Game starts by sending a turn alert
    Given an in progress tic-tac-toe game
    Then tic-tac-toe-turn domain event is called

Scenario Outline: Player can select a square
    Given an in progress tic-tac-toe game
    When the current player selects tile <X>,<Y>
    Then coordinate <X>,<Y> is "X"

    Examples:

    | X | Y |
    | 0 | 0 |
    | 1 | 1 |
    | 2 | 2 |

Scenario: the non-current player cannot select a tile
    Given an in progress tic-tac-toe game
    When the non-current player selects a tile
    Then coordinate 0,0 is " "

Scenario Outline: win conditions
    Given an in progress tic-tac-toe game
    When tile <X1>,<Y1> is already "X"
    And tile <X2>,<Y2> is already "X"
    And the current player selects tile <SelectX>,<SelectY>
    Then game win domain event is called
    And winning player is current player

    Examples:

    | X1 | Y1 | X2 | Y2 | SelectX | SelectY |
    | 0  | 0  | 1  | 0  | 2       | 0       |
    | 0  | 1  | 1  | 1  | 2       | 1       |
    | 0  | 2  | 1  | 2  | 2       | 2       |
    | 0  | 0  | 0  | 1  | 0       | 2       |
    | 1  | 0  | 1  | 1  | 1       | 2       |
    | 2  | 0  | 2  | 1  | 2       | 2       |
    | 0  | 0  | 1  | 1  | 2       | 2       |
    | 0  | 2  | 1  | 1  | 2       | 0       |

Scenario: switch turns
    Given an in progress tic-tac-toe game
    When the current player selects tile 0,0
    Then tic-tac-toe-turn domain event is called
    And current player is now player 2
    When the current player selects tile 0,1
    Then coordinate 0,1 is "O"