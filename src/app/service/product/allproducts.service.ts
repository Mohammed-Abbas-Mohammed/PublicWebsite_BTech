import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductB } from '../../models/product-b';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllproductsService {

  constructor(private http: HttpClient) {}

  private thisapi='https://localhost:7122/api';



  getallproducts():Observable<ProductB[]> {
    return this.http.get<ProductB[]>(`${this.thisapi}/product`);
  }


  fillterproduct():Observable<ProductB[]> {
    return this.http.get<ProductB[]>('https://fakestoreapi.com/products/category/jewelery');
  }



  getProductById(id: Number): Observable<any> {
    return this.http.get(`${this.thisapi}/Product/${id}`);

  }

  getProductsByCategoryId(categoryId: number): Observable<ProductB[]> {
    return this.http.get<ProductB[]>(`${this.thisapi}/Category/GetProductsByCategoryId/${categoryId}`);
  }



  // getProductsByCategoryName(categoryName: string): Observable<ProductB[]> {
  //   return this.http.get<ProductB[]>(`${this.thisapi}/Category/GetProductsByCategoryName/${categoryName}`);
  // }

 
  getProductsByCategoryName(categoryName: string): Observable<any> {
    return this.http.get<any>(`${this.thisapi}/Category/GetProductsByCategoryName/${categoryName}`);
  }
   
  getPaginatedProducts(pageNumber: number, pageSize: number): Observable<ProductB[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ProductB[]>(`${this.thisapi}/product/GetPaginated`, { params });
  }
  
  
 
}
