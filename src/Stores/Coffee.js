import { Client } from '../Client.js';
import { takeUntil } from 'rxjs/operators';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import BaseStore from './Base';

const resetStore = () => ({
  coffees: initLanguageCodeObject(),
  processings: [],
  productStatuses: []
});
let { coffees, processings, productStatuses } = resetStore();

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

class Coffee extends BaseStore {
  constructor() {
    super();
  }

  fetchCoffees(language) {
    var query = Client.items()
      .type('coffee')
      .orderParameter('elements.product_name');

    if (language) {
      query.languageParameter(language);
    }

    query.toObservable()
      .pipe(takeUntil(this.observableUnsubscribe))
      .subscribe(response => {
        if (language) {
          coffees[language] = response.items;
        } else {
          coffees[defaultLanguage] = response.items;
        }
        this.notifyChange();
      });
  }

  // Actions
  provideCoffee(coffeeSlug, language) {
    this.fetchCoffees(language);
  }

  provideCoffees(language) {
    this.fetchCoffees(language);
  }

  provideProcessings() {
    Client.taxonomy('processing')
      .toObservable()
      .pipe(takeUntil(this.observableUnsubscribe))
      .subscribe(response => {
        processings = response.taxonomy.terms;
        this.notifyChange();
      });
  }

  provideProductStatuses() {
    Client.taxonomy('product_status')
      .toObservable()
      .pipe(takeUntil(this.observableUnsubscribe))
      .subscribe(response => {
        productStatuses = response.taxonomy.terms;
        this.notifyChange();
      });
  }

  // Methods
  getCoffee(coffeeSlug, language) {
    return coffees[language || defaultLanguage].find((coffee) => coffee.urlPattern.value === coffeeSlug);
  }

  getCoffees(language) {
    return coffees[language];
  }

  getProcessings() {
    return processings;
  }

  getProductStatuses() {
    return productStatuses;
  }

  getFilter() {
    return coffeeFilter;
  }

  setFilter(filter) {
    coffeeFilter = filter;
    this.notifyChange();
  }
}

let CoffeeStore = new Coffee();

export { CoffeeStore, resetStore };