// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';// Assurez-vous que le chemin vers votre AuthService est correct
import { map, take, tap, delay, catchError } from 'rxjs/operators'; // Ajoutez 'delay'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  // Injectez le Router pour les redirections et l'AuthService pour la logique d'authentification
  constructor(
    private router: Router,
    private authService: AuthService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    delay(2000); // Ajoutez un délai de 1 seconde pour simuler une attente
    const currentUser = this.authService.currentUserValue; // Récupère l'objet utilisateur actuel

    // 1. Vérifier si l'utilisateur est connecté
    console.log('Utilisateur courant: bi', currentUser);
    console.log('Utilisateur courant: role', currentUser?.role);
    console.log('Utilisateur courant: isLoggedIn', this.authService.isLoggedIn());
    if (!currentUser || !this.authService.isLoggedIn()) {
      // Si non connecté, rediriger vers la page de connexion
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Ajoute returnUrl pour revenir après login
      return false;
    }

    // 2. Vérifier les rôles si la route en requiert
    const requiredRoles = route.data['role'] as Array<string>;

    if (requiredRoles && requiredRoles.length > 0) {
      // Assurez-vous que l'utilisateur a des rôles et que c'est un tableau
      const userRoles = currentUser.role;

      if (!userRoles || !Array.isArray(userRoles)) {
        // L'utilisateur n'a pas de rôles ou les rôles ne sont pas un tableau
        this.router.navigate(['/access-denied']); // Rediriger vers une page d'accès refusé
        return false;
      }

      // Vérifier si l'utilisateur possède au moins un des rôles requis
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        // L'utilisateur n'a pas les rôles requis, rediriger vers la page d'accès refusé
        this.router.navigate(['/access-denied']);
        return false;
      }
    }

    // Si toutes les vérifications passent, autoriser l'accès à la route
    return true;
  }
}