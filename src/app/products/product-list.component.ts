import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EMPTY, catchError, map } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';

import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories$ = this.productCategoryService.productCategories$;
  selectedCategoryId = 1;

  products$ = this.productService.productsWithCategories$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  filteredProducts$ = this.productService.productsWithCategories$.pipe(
    map((products) => {
      return products.filter(({ categoryId }) =>
        this.selectedCategoryId ? this.selectedCategoryId === categoryId : true
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
    this.selectedCategoryId = +categoryId;
  }
}
