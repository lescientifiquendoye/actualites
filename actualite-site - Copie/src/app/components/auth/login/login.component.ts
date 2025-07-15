import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // <-- Importez ReactiveFormsModule
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'; // <-- Importez MatIconModule
import { CommonModule } from '@angular/common'; // Important pour *ngIf, *ngFor
import { AuthService } from '../../../service/auth.service';

// Si vous avez un AuthService, assurez-vous qu'il est `providedIn: 'root'` ou importez-le ici
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true, // <-- Déclarez le composant comme autonome
  imports: [
    CommonModule,        // Nécessaire pour les directives structurelles comme *ngIf, *ngFor
    ReactiveFormsModule, // <-- Ajoutez ReactiveFormsModule ici
    MatIconModule        // <-- Ajoutez MatIconModule ici
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Assurez-vous que AuthService est importé
    private router: Router,
    // private authService: AuthService // Si AuthService est `providedIn: 'root'`, il peut être injecté directement
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (user) => {
          // Rediriger vers la page d'accueil ou une autre page après la connexion réussie
          this.router.navigate(['/editeur-dashboard']);
        },
        error: (error) => { 
          // Gérer l'erreur de connexion
          this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
          console.error('Erreur de connexion:', error);
        } 
    });
  };
}}