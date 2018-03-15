import Client from "../Client.js";

import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes'

let changeListeners = [];
let facts = initLanguageCodeObject();

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

  return query.get()
      .toPromise()
    .then(response => {
      if(language){
        facts[language] = response.item.facts;
      } else {
        facts[defaultLanguage] = response.item.facts;        
      }
      notifyChange();
      return response.item.facts;
    });
}

class FactStore {

  // Actions

  provideFacts(language) {
    return fetchFacts(language);
  }

  // Methods

  getFacts(language) {
    // return facts[language];
      return this.provideFacts(language);
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

}

export default new FactStore();