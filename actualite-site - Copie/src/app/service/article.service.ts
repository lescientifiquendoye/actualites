import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../model/article.service';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  
  private apiUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient) {}

  getAllArticles(): Observable<Article[]> {
    const resultat= this.http.get<Article[]>(`${this.apiUrl}`);
    return resultat;
  }

  

  getArticlesByCategorie(nom: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/categorie/${nom}`);
  }

  deleteArticle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  addArticle(article: any): Observable<Article> {
    return this.http.post<any>(this.apiUrl, article);
  }
  updateArticle(articleId:Number,article:any): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${articleId}`, article);
  }
}
