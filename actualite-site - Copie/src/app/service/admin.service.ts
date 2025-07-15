// src/app/service/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../model/utilisateur.service';

// Modèles pour les utilisateurs et rôles côté frontend
export interface User {
  id?: number;
  email: string;
  motDePasse?: string; // Optionnel pour la modification, jamais affiché
  role: String;
}

export interface Role {
  id?: number;
  name: string; // Ex: "ROLE_ADMIN", "ROLE_EDITOR"
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/utilisateurs'; // Base URL pour les endpoints admin

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir les headers avec le token JWT (si vous utilisez JWT)
  // Ou l'authentification Basic si vous l'avez configurée côté Spring Security
  private getAuthHeaders(): HttpHeaders {
    // Exemple avec un token JWT stocké dans le localStorage
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Si JWT
      // Ou 'Authorization': 'Basic ' + btoa('username:password') // Si Basic Auth
    });
  }

  // --- Gestion des Utilisateurs ---
  getAllUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, {
      login:user.email,
      ...user,
    });
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, {
      login:user.email,
      ...user,
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Gestion des Rôles (pour la liste déroulante lors de la création/modification d'utilisateur) ---
  getAllRoles(): Observable<Role[]> {
    // Vous pourriez avoir un endpoint séparé pour cela si les rôles ne sont pas renvoyés avec les utilisateurs.
    // Ou si les rôles sont fixes, vous pouvez les gérer en frontend.
    // Par exemple: return this.http.get<Role[]>(`http://localhost:8080/api/roles`, { headers: this.getAuthHeaders() });
    // Pour l'instant, simule une réponse:
    return new Observable(observer => {
      observer.next([
        { id: 1, name: "ROLE_ADMIN" },
        { id: 2, name: "ROLE_EDITOR" },
        { id: 3, name: "ROLE_USER" }
      ]);
      observer.complete();
    });
  }

  // --- Gestion des Jetons (conceptuel, à adapter à votre implémentation de jetons) ---
  // generateNewAuthToken(): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/tokens/generate`, {}, { headers: this.getAuthHeaders() });
  // }

  // revokeAuthToken(tokenId: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/tokens/${tokenId}`, { headers: this.getAuthHeaders() });
  // }
}