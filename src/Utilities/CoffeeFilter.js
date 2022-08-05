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