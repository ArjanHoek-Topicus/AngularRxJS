import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  BehaviorSubject,
  EMPTY,
  Subject,
  catchError,
  combineLatest,
  map,
  startWith,
  tap,
} from 'rxjs';

import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';

  private errorMessageSubject = new Subject<string>();

  errorMessage$ = this.errorMessageSubject.asObservable();

  private selectedCategorySubject = new BehaviorSubject<number>(0);
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  products$ = combineLatest([
    this.productService.productsWithCategories$,
    this.selectedCategory$,
  ]).pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    }),
    map(([products, selectedCategoryId]) => {
      return products.filter(({ categoryId: id }) =>
        selectedCategoryId ? selectedCategoryId === id : true
      );
    })
  );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.selectedCategorySubject.next(+categoryId);
  }
}
