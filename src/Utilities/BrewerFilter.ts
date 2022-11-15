import type { Brewer } from '@/models';

export interface PriceRange {
  min: number;
  max: number;
}

export class Filter {
  manufacturers: Array<string>;
  priceRanges: Array<PriceRange>;
  productStatuses: Array<string>;

  constructor() {
    this.manufacturers = [];
    this.priceRanges = [];
    this.productStatuses = [];
  }

  matches(brewer: Brewer): boolean {
    return (
      this.matchesManufacturers(brewer) &&
      this.matchesPriceRanges(brewer) &&
      this.matchesProductStatuses(brewer)
    );
  }

  matchesManufacturers(brewer: Brewer): boolean {
    if (this.manufacturers.length === 0) {
      return true;
    }

    const manufacturerCodenames = brewer.elements.manufacturer.value.map(
      (x) => x.codename
    );
    return manufacturerCodenames.some((x) => this.manufacturers.includes(x));
  }

  matchesPriceRanges(brewer: Brewer): boolean {
    if (this.priceRanges.length === 0) {
      return true;
    }

    const price = brewer.elements.price.value as number;

    return this.priceRanges.some(
      (priceRange) => priceRange.min <= price && price <= priceRange.max
    );
  }

  matchesProductStatuses(brewer: Brewer): boolean {
    if (this.productStatuses.length === 0) {
      return true;
    }

    const statusCodenames = brewer.elements.productStatus.value.map(
      (x) => x.codename
    );
    return statusCodenames.some((x) => this.productStatuses.includes(x));
  }

  toggleManufacturer(manufacturer: string): void {
    const index = this.manufacturers.indexOf(manufacturer);

    if (index < 0) this.manufacturers.push(manufacturer);
    else this.manufacturers.splice(index, 1);
  }

  togglePriceRange(priceRange: PriceRange): void {
    const index = this.priceRanges.findIndex(
      (x) => x.min === priceRange.min && x.max === priceRange.max
    );

    if (index < 0) this.priceRanges.push(priceRange);
    else this.priceRanges.splice(index, 1);
  }

  toggleProductStatus(productStatus: string): void {
    const index = this.productStatuses.indexOf(productStatus);

    if (index < 0) this.productStatuses.push(productStatus);
    else this.productStatuses.splice(index, 1);
  }
}
