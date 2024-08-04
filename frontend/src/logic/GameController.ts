import { MoveResult } from '@/logic/GameLogic';
import EventEmitter, {
  EmitterSubscription,
} from 'react-native/Libraries/vendor/emitter/EventEmitter';

export type GameControllerEvents = {
  playMove: (column: number) => void;
  onMovePlayed: (moveResult: MoveResult) => void;
};

export class GameController<TContext, TInputContext> extends EventEmitter {
  private _isInitialized = false;
  private _context: TContext | null = null;
  constructor(
    private controllerCreator: (
      gameController: GameController<TContext, TInputContext>,
      inputContext: TInputContext,
    ) => TContext,
  ) {
    super();
  }

  initialize(
    eventHandlers: GameControllerEvents,
    inputContext: TInputContext,
  ): GameController<TContext, TInputContext> {
    this.removeAllListeners();
    this._context = this.controllerCreator(this, inputContext);

    this.addListener('playMove', eventHandlers.playMove);
    this.addListener('onMovePlayed', eventHandlers.onMovePlayed);
    return this;
  }

  addListener<TEvent extends keyof GameControllerEvents>(
    eventType: TEvent,
    listener: GameControllerEvents[TEvent],
    context?: any,
  ): EmitterSubscription {
    return super.addListener(
      eventType,
      listener,
      context,
    ) as EmitterSubscription;
  }
  emit<TEvent extends keyof GameControllerEvents>(
    eventType: TEvent,
    ...params: Parameters<GameControllerEvents[TEvent]>
  ) {
    super.emit(eventType, ...params);
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
