import { defineFeature, loadFeature } from "jest-cucumber";
import { IMock, It, Mock, Times } from "typemoq";
import { IObserver } from "../../../domain/interfaces/observers/IObserver";
import { TicTacToe } from "../../../domain/tic_tac_toe/tic-tac-toe";

const feature = loadFeature('src/__tests__/features/tic_tac_toe/tic-tac-toe.feature');

defineFeature(feature, test => {
  const player1 = "Player 1";
  const player2 = "Player 2";
  let game: TicTacToe;
  let ticTacToeTurn: IMock<IObserver>;

  beforeEach(() => {
    ticTacToeTurn = Mock.ofType<IObserver>();
  });

  function given_an_in_progress_tic_tac_toe_game() {
    game = new TicTacToe();
    game.setPlayers([player1, player2])
  }

  test('2 players', ({
    given,
    when,
    then,
    and
  }) => {
    given('a tic-tac-toe game', () => {
      game = new TicTacToe();
      game.ticTacToeTurn.attach(ticTacToeTurn.object);
    });

    when("two players join the game", () => {
      game.setPlayers([player1, player2])
    });

    then('current player is the first to join', () => {
      expect(game.currentPlayer).toBe(player1);
    });

    and('tic-tac-toe-turn domain event is called', () => {
      ticTacToeTurn.verify(mock => mock.update(It.isAny()), Times.once());
    });
  });

  test('Player can select a square', ({
    given,
    when,
    then
  }) => {
    given('an in progress tic-tac-toe game', () => {
      given_an_in_progress_tic_tac_toe_game();
    });
  
    when(/^the current player selects tile (.*) and (.*)$/, (x, y) => {
      game.selectTile(player1, x, y);
    });
  
    then(/^coordinate (.*) and (.*) is selected$/, (x, y) => {
      expect(game.selectedTile).toStrictEqual([x, y]);
    });
  });

  test('the non-current player cannot select a tile', ({
    given,
    when,
    then
  }) => {
    given('an in progress tic-tac-toe game', () => {
      given_an_in_progress_tic_tac_toe_game();
    });
  
    when('the non-current player selects a tile', () => {
      game.selectTile(player2, 0, 0);
    });
  
    then('do not update selected tile', () => {
      expect(game.selectedTile).toBeUndefined();
    });
  });
});