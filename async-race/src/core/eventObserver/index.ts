class EventObserver<Listener> {
  observers: Array<(T: Listener) => void>;
  constructor() {
    this.observers = [];
  }
  subscribe(observer: (T: Listener) => void): void {
    this.observers.push(observer);
  }
  unsubscribe(observer: (T: Listener) => void): void {
    this.observers = this.observers.filter((subscriber) => subscriber !== observer);
  }
  notify(data: Listener): void {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

export default EventObserver;
