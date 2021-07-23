import { IObserver } from './../../../domain/interfaces/observers/IObserver';
import { defineFeature, loadFeature } from "jest-cucumber";
import { IMock, It, Mock, Times } from "typemoq";
import { TicTacToe } from "../../../domain/tic_tac_toe/tic-tac-toe";

const feature = loadFeature('src/__tests__/features/tic_tac_toe/tic-tac-toe.feature');

defineFeature(feature, test => {
  const player1 = "Player 1";
  const player2 = "Player 2";
  let game: TicTacToe;
  let ticTacToeTurn: IMock<IObserver>;
  let gameEnd: IMock<IObserver>;

  beforeEach(() => {
    ticTacToeTurn = Mock.ofType<IObserver>();
    gameEnd = Mock.ofType<IObserver>();
  });

  const given_an_in_progress_tic_tac_toe_game = (given) => {
    given('an in progress tic-tac-toe game', () => {
      game = new TicTacToe();
      game.ticTacToeTurn.attach(ticTacToeTurn.object);
      game.gameEnd.attach(gameEnd.object);
      game.setPlayers([player1, player2]);
    });
  }

  const when_the_current_player_selects_tile_x_and_y = (when) => {
    when(/^the current player selects tile (.*),(.*)$/, (x, y) => {
      game.selectTile(player1, x, y);
    });
  }

  const when_tile_is_already_pieceValue = (when) => {
    when(/^tile (.*),(.*) is already "(.*)"$/, (x, y, pieceValue) => {
      game.board[y][x] = pieceValue;
    });
  }

  const then_coordinate_x_and_y_is_pieceValue = (then) => {
    then(/^coordinate (.*),(.*) is "(.*)"$/, (x, y, pieceValue) => {
      expect(game.board[y][x]).toEqual(pieceValue);
    });
  }

  test('2 players', ({
    given,
    when,
    then
  }) => {
    given('a tic-tac-toe game', () => {
      game = new TicTacToe();
    });

    when("two players join the game", () => {
      game.setPlayers([player1, player2])
    });

    then('current player is the first to join', () => {
      expect(game.currentPlayer).toBe(player1);
    });
  });

  test('Game starts by sending a turn alert', ({
    given,
    then
  }) => {
    given_an_in_progress_tic_tac_toe_game(given);
  
    then('tic-tac-toe-turn domain event is called', () => {
      ticTacToeTurn.verify(mock => mock.update(It.isAny()), Times.once());
    });
  });

  test('Player can select a square', ({
    given,
    when,
    then
  }) => {
    given_an_in_progress_tic_tac_toe_game(given);

    when_the_current_player_selects_tile_x_and_y(when);

    then_coordinate_x_and_y_is_pieceValue(then);
  });

  test('the non-current player cannot select a tile', ({
    given,
    when,
    then
  }) => {
    given_an_in_progress_tic_tac_toe_game(given);

    when('the non-current player selects a tile', () => {
      game.selectTile(player2, 0, 0);
    });

    then_coordinate_x_and_y_is_pieceValue(then);
  });

  test('win conditions', ({
    given,
    when,
    and,
    then
  }) => {
    given_an_in_progress_tic_tac_toe_game(given);

    when_tile_is_already_pieceValue(when);

    when_tile_is_already_pieceValue(and);

    when_the_current_player_selects_tile_x_and_y(and);

    then('game win domain event is called', () => {
      gameEnd.verify(mock => mock.update(It.isAny()), Times.once());
    });

    and('winning player is current player', () => {
      expect(game.winningPlayer).toBe(player1);
    });
  });

  test('switch turns', ({
    given,
    when,
    then
  }) => {
    given_an_in_progress_tic_tac_toe_game(given);
  
    when_the_current_player_selects_tile_x_and_y(when);

    then('tic-tac-toe-turn domain event is called', () => {
      ticTacToeTurn.verify(mock => mock.update(It.isAny()), Times.exactly(2));
    });
  });
});