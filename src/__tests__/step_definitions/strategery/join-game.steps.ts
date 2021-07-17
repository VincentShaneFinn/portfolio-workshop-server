import { defineFeature, loadFeature } from "jest-cucumber";
import { IObserver } from "../../../domain/interfaces/observers/IObserver";
import { StrategeryLobby } from "../../../domain/strategery/strategery-lobby";
import { IMock, It, Mock, Times } from 'typemoq';

const feature = loadFeature('src/__tests__/features/strategery/join-game.feature');

defineFeature(feature, test => {
  let lobby: StrategeryLobby;
  let playersChangedEvent: IMock<IObserver>;
  let hostChangedEvent: IMock<IObserver>;
  let allDisconnected: IMock<IObserver>;

  beforeEach(() => {
    lobby = new StrategeryLobby();
    playersChangedEvent = Mock.ofType<IObserver>();
    hostChangedEvent = Mock.ofType<IObserver>();
    allDisconnected = Mock.ofType<IObserver>();
    lobby.playersChangedEvent.attach(playersChangedEvent.object);
    lobby.hostChangedEvent.attach(hostChangedEvent.object);
    lobby.allDisconnectedEvent.attach(allDisconnected.object);
  })

  const given_players_in_the_game = (given) => {
    given('players in the game', () => {
      lobby.addPlayer("Player 1");
      lobby.addPlayer("Player 2");
    });
  }

  const when_player_is_added_to_game = (when) => {
    when(/^(.*) is added to the game$/, (playerName) => {
      lobby.addPlayer(playerName);
    });
  }

  const when_player_is_removed_from_game = (when) => {
    when(/^(.*) is removed from the game$/, (playerName) => {
      lobby.removePlayer(playerName);
    });
  }

  const then_player_is_in_the_list_of_players = (then) => {
    then(/^(.*) is in the list of players$/, (playerName) => {
      expect(lobby.players).toContain(playerName);
    });
  }

  test('Can add one player to the game', ({
    when,
    then
  }) => {
    when_player_is_added_to_game(when);

    then_player_is_in_the_list_of_players(then);
  });

  test('First Player to join is the host', ({
    when,
    then
  }) => {
    when_player_is_added_to_game(when);

    then(/^(.*) is the host$/, (playerName) => {
      expect(lobby.host).toBe(playerName);
    });
  });

  test('Can add multiple players', ({
    when,
    and,
    then
  }) => {
    when_player_is_added_to_game(when);

    when_player_is_added_to_game(and);

    then_player_is_in_the_list_of_players(then);

    and(/^there are (.*) players$/, (playerCount) => {
      expect(lobby.players.length).toBe(parseInt(playerCount));
    });
  });

  test('Can remove player from the game', ({
    when,
    and,
    then
  }) => {
    when_player_is_added_to_game(when);

    when_player_is_removed_from_game(and);

    then(/^(.*) is not in the list of players$/, (playerName) => {
      expect(lobby.players).not.toContain(playerName);
    });
  });

  test('Promote next player to host when current host leaves', ({
    given,
    when,
    then
  }) => {
    given_players_in_the_game(given);

    when('the host is removed from the game', () => {
      lobby.removePlayer("Player 1");
    });

    then('the next player is promoted to host;', () => {
      expect(lobby.host).toBe("Player 2");
    });
  });

  test('Clear host when all players have left', ({
    given,
    when,
    then
  }) => {
    given_players_in_the_game(given);

    when('All players are removed from the game', () => {
      lobby.removePlayer("Player 1");
      lobby.removePlayer("Player 2");
    });

    then('the host is cleared', () => {
      expect(lobby.host).toBe(null);
    });
  });

  test('Call domain event when the list of players changes', ({
    when,
    then
  }) => {
    when_player_is_added_to_game(when);

    then('players-changed domain event is called', () => {
      playersChangedEvent.verify(mock => mock.update(It.isAny()), Times.once());
    });

    when_player_is_removed_from_game(when);

    then('players-changed domain event is called again', () => {
      playersChangedEvent.verify(mock => mock.update(It.isAny()), Times.exactly(2));
    });
  });
  test('Call domain event when the host changes', ({
    when,
    then
  }) => {
    when_player_is_added_to_game(when);

    then('host-changed event is called', () => {
        hostChangedEvent.verify(mock => mock.update(It.isAny()), Times.once());
      });
      
      when_player_is_removed_from_game(when);
      
      then('host-changed event is fired again', () => {
        hostChangedEvent.verify(mock => mock.update(It.isAny()), Times.exactly(2));
    });
  });
  test('Call domain event when all players disconnected fires a special', ({
    when,
    and
  }) => {
    when_player_is_added_to_game(when);

    when_player_is_removed_from_game(when);

    when('all-disconnected event is called', () => {
      allDisconnected.verify(mock => mock.update(It.isAny()), Times.once());
    });
  });
});