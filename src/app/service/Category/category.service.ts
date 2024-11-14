import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CategoryB } from '../../models/category-b';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private thisapi='https://btechapi.runasp.net/api';


  constructor(private http:HttpClient) { }


  getallcategory():Observable<CategoryB[]>{
    return this.http.get<CategoryB[]>(`${this.thisapi}/Category`)
   }

   getmainCategories():Observable<CategoryB[]>{
    return this.http.get<CategoryB[]>(`${this.thisapi}/Category/GetMainCategories`)
  }

  getsubCategories():Observable<CategoryB[]>{
    return this.http.get<CategoryB[]>(`${this.thisapi}/Category/GetSubCategories`)
  }

  getsubcategoriesbuyMainId(id: number):Observable<CategoryB[]>{
    return this.http.get<CategoryB[]>(`${this.thisapi}/Category/subcategories/${id}`)
  }

  searchCategoriesByName(name: string): Observable<CategoryB[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<CategoryB[]>(`${this.thisapi}/Category/Search`, { params });
  }

 getCategorybyId(id:number) : Observable<CategoryB>{
  return this.http.get<CategoryB>(`${this.thisapi}/Category/GetById/${id}`)
 }

 filterCategoriesbyLanguage(languageId: number): Observable<CategoryB[]> {
  const params = new HttpParams().set('languageId', languageId.toString());
  return this.http.get<CategoryB[]>(`${this.thisapi}/Category/FilterByLanguage`, { params });
}


getProductsByCategoryName(categoryName: string): Observable<any> {
  return this.http.get<any>(`${this.thisapi}/Category/GetProductsByCategoryName/${categoryName}`);
}

}
