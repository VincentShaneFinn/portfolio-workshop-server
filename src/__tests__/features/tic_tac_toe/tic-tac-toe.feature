Feature: Tic-Tac-Toe

Scenario: 2 players
    Given a tic-tac-toe game
    When two players join the game
    Then current player is the first to join
    And tic-tac-toe-turn domain event is called

Scenario Outline: Player can select a square
    Given an in progress tic-tac-toe game
    When the current player selects tile <X> and <Y>
    Then coordinate <X> and <Y> is selected

    Examples:

    | X | Y |
    | 0 | 0 |
    | 1 | 1 |
    | 2 | 2 |

Scenario: the non-current player cannot select a tile
    Given an in progress tic-tac-toe game
    When the non-current player selects a tile
    Then do not update selected tile

# on tile select, update space character
# do not allow selecting if the space is already filled
# check for win condition false
# check for win conditions true
# switch players
