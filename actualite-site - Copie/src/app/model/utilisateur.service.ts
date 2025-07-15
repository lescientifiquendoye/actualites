import { Injectable } from '@angular/core';
export interface Utilisateur{
  userId:Number,
  email:String,
  role:String,
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor() { }
}
