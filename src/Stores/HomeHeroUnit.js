import { Client } from '../Client.js';
import { takeUntil } from 'rxjs/operators';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import BaseStore from './Base';

const resetStore = () => ({
  heroUnits: initLanguageCodeObject()
});
let { heroUnits } = resetStore();

class HomeHeroUnit extends BaseStore {
  constructor() {
    super();
  }

  fetchHomeHeroUnits(language) {
    var query = Client.item('home').elementsParameter(['hero_unit', 'title', 'image', 'marketing_message']);

    if (language) {
      query.languageParameter(language);
    }

    query.toObservable()
      .pipe(takeUntil(this.observableUnsubscribe))
      .subscribe(response => {
        if (language) {
          heroUnits[language] = response.item.heroUnit.value;
        } else {
          heroUnits[defaultLanguage] = response.item.heroUnit.value;
        }
        this.notifyChange();
      });
  }

  // Actions
  provideHomeHeroUnits(language) {
    this.fetchHomeHeroUnits(language);
  }

  // Methods
  getHomeHeroUnits(language) {
    return heroUnits[language];
  }

  getFirstHomeHeroUnit(language) {
    return heroUnits[language] && heroUnits[language][0];
  }
}

let HomeHeroUnitStore = new HomeHeroUnit();

export { HomeHeroUnitStore, resetStore }