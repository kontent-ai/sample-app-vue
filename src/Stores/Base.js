import { Subject } from 'rxjs';

class BaseStore {
  constructor() {
    this.observableUnsubscribe;
    this.changeListeners = [];
  }

  addChangeListener(listener) {
    this.changeListeners.push(listener);
  }

  removeChangeListener(listener) {
    this.changeListeners = this.changeListeners.filter((element) => {
      return element !== listener;
    });
  }

  notifyChange() {
    this.changeListeners.forEach((listener) => {
      listener();
    });
  }

  subscribe() {
    this.observableUnsubscribe = new Subject();
  }

  unsubscribe() {
    this.observableUnsubscribe.next();
    this.observableUnsubscribe.complete();
  }
}

export default BaseStore;