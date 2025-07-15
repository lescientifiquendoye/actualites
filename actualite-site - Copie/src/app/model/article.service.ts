import { Injectable } from '@angular/core';
import { Categorie } from './categorie.service';
export interface Article {
  id: number;
  titre: string;
  description: string;
  contenu: string;
  date: string;
  categorie: Categorie;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor() { }
}
