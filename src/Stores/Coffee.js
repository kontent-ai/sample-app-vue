import Client from "../Client.js";

import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes'

let changeListeners = [];
let coffees = initLanguageCodeObject();
let processings = [];
let productStatuses = [];

let notifyChange = () => {
  changeListeners.forEach((listener) => {
    listener();
  });
}

let fetchCoffees = (language) => {

  var query = Client.items()
    .type('coffee')
    .orderParameter('elements.product_name');

  if (language) {
    query.languageParameter(language);
  }

  return query.get()
      .toPromise()
    .then(response => {
      if (language) {
        coffees[language] = response.items;
      } else {
        coffees[defaultLanguage] = response.items;
      }
      notifyChange();
      return response.items;
    });
}

let fetchProcessings = () => {
  return Client.taxonomy("processing")
    .get()
      .toPromise()
    .then(response => {
      processings = response.taxonomy.terms;
      notifyChange();
      return response.taxonomy.terms;
    });
};

let fetchProductStatuses = () => {
  return Client.taxonomy("product_status")
    .get()
      .toPromise()
    .then(response => {
      productStatuses = response.taxonomy.terms;
      notifyChange();
      return response.taxonomy.terms;
    });
}

export class Filter {
  constructor() {
    this.processings = [];
    this.productStatuses = [];
  }

  matches(coffee) {
    return this.matchesProcessings(coffee) && this.matchesProductStatuses(coffee);
  }

  matchesProcessings(coffee) {
    if (this.processings.length === 0) {
      return true;
    }

    let processings = coffee.processing.value.map(x => x.codename);

    return this.processings.some(x => processings.includes(x));
  }

  matchesProductStatuses(coffee) {
    if (this.productStatuses.length === 0) {
      return true;
    }

    let statuses = coffee.productStatus.value.map(x => x.codename);

    return this.productStatuses.some(x => statuses.includes(x));
  }

  toggleProcessing(processing) {
    let index = this.processings.indexOf(processing);

    if (index < 0) this.processings.push(processing); else this.processings.splice(index, 1);
  }

  toggleProductStatus(status) {
    let index = this.productStatuses.indexOf(status);

    if (index < 0) this.productStatuses.push(status); else this.productStatuses.splice(index, 1);
  }
}

let coffeeFilter = new Filter();

class CoffeeStore {

  // Actions

  provideCoffee(coffeeSlug, language) {
    fetchCoffees(language);
  }

  provideCoffees(language) {
    return fetchCoffees(language);
  }

  provideProcessings() {
    return fetchProcessings();
  }

  provideProductStatuses() {
    return fetchProductStatuses();
  }

  // Methods

  getCoffee(coffeeSlug, language) {

    return coffees[language || defaultLanguage].find((coffee) => coffee.urlPattern.value === coffeeSlug);
  }

  getCoffees(language) {
    // return coffees[language];
      return this.provideCoffees(language);
  }

  getProcessings() {
    // return processings;
      return this.provideProcessings();
  }

  getProductStatuses() {
    // return productStatuses;
      return this.provideProductStatuses();
  }

  getFilter() {
    return coffeeFilter;
  }

  setFilter(filter) {
    coffeeFilter = filter;
    notifyChange();
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

export default new CoffeeStore();
