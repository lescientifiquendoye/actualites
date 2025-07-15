// src/app/services/categorie.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categorie } from '../model/categorie.service'; // Assure-toi que ce fichier existe

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  // Obtenir toutes les catégories
  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl);
  }

  deleteCategory(id: number): Observable<String> {
    return this.http.delete<String>(`${this.apiUrl}/${id}`);
  }

  // Obtenir une catégorie par son nom
  getCategorieByNom(nom: string): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${nom}`);
  }

  editCategory(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${id}`, categorie); 
  }
  addCategory(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl, categorie);
  }

  // Obtenir une catégorie par ID
  getCategorieById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
  }
}
