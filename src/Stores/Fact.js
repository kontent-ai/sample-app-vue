import { Client } from '../Client.js';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes'

const resetStore = () => ({
  facts: initLanguageCodeObject()
});
let { facts } = resetStore();

let unsubscribe = new Subject();

let changeListeners = [];

let notifyChange = () => {
  changeListeners.forEach((listener) => {
    listener();
  });
}

let fetchFacts = (language) => {
  var query = Client.item('about_us')

  if (language) {
    query.languageParameter(language);
  }

  query.getObservable()
    .pipe(takeUntil(unsubscribe))
    .subscribe(response => {
      if (language) {
        facts[language] = response.item.facts;
      } else {
        facts[defaultLanguage] = response.item.facts;
      }
      notifyChange();
    });
}

class Fact {

  // Actions

  provideFacts(language) {
    fetchFacts(language);
  }

  // Methods

  getFacts(language) {
    return facts[language];
  }

  // Listeners

  addChangeListener(listener) {
    changeListeners.push(listener);
  }

  removeChangeListener(listener) {
    changeListeners = changeListeners.filter((element) => {
      return element !== listener;
    });
  }

  unsubscribe() {
    unsubscribe.next();
    unsubscribe.complete();
    unsubscribe = new Subject();
  }
}

let FactStore = new Fact();

export { FactStore, resetStore }