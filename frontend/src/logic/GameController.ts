import { MoveResult, PlayerColor } from '@/logic/GameLogic';
import EventEmitter, {
  EmitterSubscription,
} from 'react-native/Libraries/vendor/emitter/EventEmitter';

export type GameControllerEvents = {
  playMove: (column: number) => void;
  onMovePlayed: (moveResult: MoveResult) => void; // Move played by any player, bot or remote player
  onCurrentPlayerMovePlayed: () => void; // Move played by player
  onOpponentPlayerMovePlayed: () => void; // Move played by bot or remote player
  onGameStarted: (gameState: { startingPlayerColor: PlayerColor }) => void;
};

export class GameController<TContext, TInputContext> extends EventEmitter {
  private _isInitialized = false;
  private _context: TContext | null = null;
  private _id: string;
  constructor(
    private controllerCreator: (
      gameController: GameController<TContext, TInputContext>,
      inputContext: TInputContext,
    ) => TContext,
  ) {
    super();
    this._id = Math.floor(Math.random() * 100000000).toString();
  }

  initialize(
    eventHandlers: Partial<GameControllerEvents>,
    inputContext: TInputContext,
  ): GameController<TContext, TInputContext> {
    this.removeAllListeners();
    this._context = this.controllerCreator(this, inputContext);

    for (const key of Object.keys(eventHandlers)) {
      const typedKey = key as keyof GameControllerEvents;
      if (typeof eventHandlers[typedKey] === 'function') {
        this.addListener(typedKey, eventHandlers[typedKey]);
      }
    }
    return this;
  }

  addListener<TEvent extends keyof GameControllerEvents>(
    eventType: TEvent,
    listener: GameControllerEvents[TEvent],
    context?: any,
  ): EmitterSubscription {
    return super.addListener(
      eventType + this._id,
      listener,
      context,
    ) as EmitterSubscription;
  }
  emit<TEvent extends keyof GameControllerEvents>(
    eventType: TEvent,
    ...params: Parameters<GameControllerEvents[TEvent]>
  ) {
    super.emit(eventType + this._id, ...params);
  }

  playMove(column: number) {
    this.emit('playMove', column);
  }

  clean() {
    this.removeAllListeners();
    this._isInitialized = false;
    this._context = null;
  }

  get isInitialized() {
    return this._isInitialized;
  }
  get context() {
    return this._context;
  }
}
