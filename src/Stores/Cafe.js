import { Client } from '../Client.js';
import { takeUntil } from 'rxjs/operators';
import { initLanguageCodeObject, defaultLanguage, languageCodes } from '../Utilities/LanguageCodes';
import BaseStore from './Base';

const resetStore = () => {
  let languageInitialized = {};
  languageCodes.forEach((language) => {
    languageInitialized[language] = false;
  });

  return {
    cafes: initLanguageCodeObject(),
    languageInitialized: languageInitialized
  }
};
let { cafes, languageInitialized } = resetStore();

class Cafe extends BaseStore {
  constructor() {
    super();
  }

  fetchCafes(language) {
    if (languageInitialized[language]) {
      this.notifyChange(language);
      return;
    }

    let query = Client.items()
      .type('cafe')
      .orderParameter('system.name');

    if (language) {
      query.languageParameter(language);
    }

    query.getObservable()
      .pipe(takeUntil(this.observableUnsubscribe))
      .subscribe(response => {
        if (language) {
          cafes[language] = response.items;
        } else {
          cafes[defaultLanguage] = response.items;
        }
        this.notifyChange(language);
        languageInitialized[language] = true;
      });
  }

  // Actions
  providePartnerCafes(language) {
    this.fetchCafes(language);
  }

  provideCompanyCafes(language) {
    this.fetchCafes(language);
  }

  // Methods
  getPartnerCafes(language) {
    return cafes[language].filter((cafe) => cafe.country.value !== 'USA');
  }

  getCompanyCafes(language) {
    return cafes[language].filter((cafe) => cafe.country.value === 'USA');
  }
}

let CafeStore = new Cafe();

export { CafeStore, resetStore };