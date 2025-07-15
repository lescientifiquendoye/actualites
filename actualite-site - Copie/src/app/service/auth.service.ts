// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importer HttpHeaders
import { Observable, BehaviorSubject, of } from 'rxjs'; // Importer 'of'
import { tap, catchError } from 'rxjs/operators'; // Importer 'catchError'
import { Utilisateur } from '../model/utilisateur.service'; // Assurez-vous que le chemin et l'interface sont corrects

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // URL de votre API d'authentification
  private currentUserSubject: BehaviorSubject<Utilisateur | null>; // Déclarez le BehaviorSubject
  public currentUser: Observable<Utilisateur | null>; // Observable public pour le composant

  constructor(private http: HttpClient) {
    
    this.currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
    this.currentUser = this.currentUserSubject.asObservable(); 

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Si un token est trouvé, configurez les en-têtes d'autorisation
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${storedToken}`
      });

      this.http.get<Utilisateur>(`${this.apiUrl}/currentuser`, { headers }).pipe(
        tap((user: Utilisateur) => {
          console.log("Utilisateur courant récupéré :", user);
          // Si l'utilisateur est récupéré avec succès, mettez à jour le BehaviorSubject
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          // En cas d'erreur (token invalide, expiré, erreur serveur, etc.), déconnectez l'utilisateur
          console.error("Échec de la récupération de l'utilisateur courant :", error);
          this.logout(); // Appelle la fonction logout pour nettoyer la session
          return of(null); // Retourne un observable de null pour que la chaîne ne s'interrompe pas
        })
      ).subscribe(); // N'oubliez pas de souscrire pour que la requête soit exécutée
    }
  }

  public get currentUserValue(): Utilisateur | null {
    // Retourne la valeur actuelle de l'utilisateur stockée dans le BehaviorSubject
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Supposons que votre API de login renvoie un objet comme { token: '...', user: {...} }
          // Où 'user' est un objet de type 'utilisateur'
          if (response.token && response.user) {
            localStorage.setItem('token', response.token); // Stocker le token JWT brut comme une chaîne
            this.currentUserSubject.next(response.user); // Mettre à jour le BehaviorSubject avec l'objet utilisateur
          } else {
            console.error("Réponse de login invalide : token ou utilisateur manquant.", response);
            // Gérer le cas où la réponse n'est pas ce qui est attendu
            this.logout();
          }
        })
      );
  }

  logout(): void {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    // Réinitialiser le BehaviorSubject à null
    this.currentUserSubject.next(null);
    // Vous pouvez ajouter ici une logique de redirection vers la page de connexion
  }

  // Exemple : Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    // Assurez-vous que 'user' et 'user.roles' existent et que 'roles' est un tableau
    return !!(user && user.role && Array.isArray(user.role) && user.role.includes(role));
  }

  isLoggedIn(): boolean {
    // L'utilisateur est considéré comme connecté si le BehaviorSubject contient une valeur non nulle
    console.log("Vérification de l'état de connexion :", this.currentUserValue);
    return this.currentUserValue !== null;
  }
}