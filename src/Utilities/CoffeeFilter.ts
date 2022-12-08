import type { Coffee } from '@/models';

export class Filter {
  processings: Array<string>;
  productStatuses: Array<string>;

  constructor() {
    this.processings = [];
    this.productStatuses = [];
  }

  matches(coffee: Coffee) {
    return (
      this.matchesProcessings(coffee) && this.matchesProductStatuses(coffee)
    );
  }

  matchesProcessings(coffee: Coffee) {
    if (this.processings.length === 0) {
      return true;
    }

    const processings = coffee.elements.processing.value.map(
      (x) => x.codename
    ) as Array<string>;

    return this.processings.some((x) => processings.includes(x));
  }

  matchesProductStatuses(coffee: Coffee) {
    if (this.productStatuses.length === 0) {
      return true;
    }

    const statuses = coffee.elements.productStatus.value.map(
      (x) => x.codename
    ) as Array<string>;

    return this.productStatuses.some((x) => statuses.includes(x));
  }

  toggleProcessing(processing: string) {
    const index = this.processings.indexOf(processing);

    if (index < 0) this.processings.push(processing);
    else this.processings.splice(index, 1);
  }

  toggleProductStatus(status: string) {
    const index = this.productStatuses.indexOf(status);

    if (index < 0) this.productStatuses.push(status);
    else this.productStatuses.splice(index, 1);
  }
}
