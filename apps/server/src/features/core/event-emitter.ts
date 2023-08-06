import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';

export type DomainEvents = {};

export type Emitter = TypedEmitter<DomainEvents>;

export const emitter = new EventEmitter() as TypedEmitter<DomainEvents>;
emitter.setMaxListeners(100);
