import { Client } from '../Client.js';
import { takeUntil } from 'rxjs/operators';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import BaseStore from './Base';

const resetStore = () => ({
  facts: initLanguageCodeObject()
});
let { facts } = resetStore();

class Fact extends BaseStore {
  constructor() {
    super();
  }

  fetchFacts(language) {
    var query = Client.item('about_us');

    if (language) {
      query.languageParameter(language);
    }

    query.toObservable()
      .pipe(takeUntil(this.observableUnsubscribe))
      .subscribe(response => {
        if (language) {
          facts[language] = response.item.facts.value;
        } else {
          facts[defaultLanguage] = response.item.facts.value;
        }
        this.notifyChange();
      });
  }

  // Actions
  provideFacts(language) {
    this.fetchFacts(language);
  }

  // Methods
  getFacts(language) {
    return facts[language];
  }
}

let FactStore = new Fact();

export { FactStore, resetStore }