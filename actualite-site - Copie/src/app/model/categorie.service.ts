import { Injectable } from '@angular/core';

export interface Categorie {
  id: number;
  nom: string;
}
@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor() { }
}
