// src/app/admin/user-management/user-management.component.ts
import { Component, OnInit, ViewChild } from '@angular/core'; // Import ViewChild
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm
import { Utilisateur } from '../../../model/utilisateur.service';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AdminService,User,Role } from '../../../service/admin.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
envoyer(estValide: boolean) {
  if (estValide) {
    
  }
}
  @ViewChild('userForm') userForm!: NgForm; // Reference to the form for resetting

  users: Utilisateur[] = [];
  role: String = '';
  roles: String[] = ["ADMIN","EDITEUR","VISITEUR"]; // Assuming you have a roles array to manage roles in the form
  userFormModel: User = this.getInitialUserFormModel(); // Single model for the form
  isEditMode: boolean = false; // Flag to indicate if we are editing
  isFormVisible: boolean = false; // To toggle visibility of the form (e.g., for modal)

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
   // this.loadRoles();
  }

  // --- Utility Methods for Form State ---
  private getInitialUserFormModel(): User {
    return { email: '', motDePasse: '', role: '' };
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.clearMessages();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs.';
      }
    });
  }

  addNewUser(): void {
    this.isEditMode = false;
    this.userFormModel = this.getInitialUserFormModel(); // Reset form for new user
    this.isFormVisible = true;
    this.clearMessages();
    // Optional: Reset NgForm state if it retains old validation messages
    this.userForm?.resetForm(this.userFormModel);
  }

  editUser(user: Utilisateur): void {
    this.isEditMode = true;
    this.userFormModel = {
      email:`${user.email}`,
      role: user.role ,
      motDePasse: '' ,
      id:Number(user.userId)
    };
    this.isFormVisible = true;

    this.clearMessages();
    // Reset NgForm state with the new model
    this.userForm?.resetForm(this.userFormModel);
  }

  cancelForm(): void {
    this.isFormVisible = false;
    this.userFormModel = this.getInitialUserFormModel(); // Reset form model
    this.isEditMode = false;
    this.clearMessages();
    this.userForm?.resetForm(this.userFormModel); 
  }

  saveUser(): void { // No need to pass form: NgForm here if using @ViewChild
    if (this.userForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis et corriger les erreurs.';
      return;
    }

    this.clearMessages();
    console.log(this.userFormModel.id)
    if ( this.isEditMode && this.userFormModel.id) {
      // Update existing user
      this.adminService.updateUser(this.userFormModel.id, this.userFormModel).subscribe({
        next: (user) => {
          this.successMessage = `Utilisateur "${user.email}" mis à jour avec succès!`;
          this.loadUsers();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
          this.errorMessage = `Erreur lors de la mise à jour de l'utilisateur: ${err.error?.message || err.message}`;
        }
      });
    } else {
      // Create new user
      this.adminService.createUser(this.userFormModel).subscribe({
        next: (user) => {
          this.successMessage = `Utilisateur "${user.email}" ajouté avec succès!`;
          this.loadUsers();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
          this.errorMessage = `Erreur lors de l'ajout de l'utilisateur: ${err.error?.message || err.message}`;
        }
      });
    }
  }

  deleteUser(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'ID utilisateur manquant pour la suppression.';
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur supprimé avec succès!';
          this.loadUsers();
          this.cancelForm(); // Close form if the deleted user was being edited
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'utilisateur:', err);
          this.errorMessage = `Erreur lors de la suppression de l'utilisateur: ${err.error?.message || err.message}`;
        }
      });
    }
  }

  onRoleChange(event: any, role: String): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      if (!this.userFormModel.role) {
        this.userFormModel.role;
      }
    } else {
      this.userFormModel.role = this.userFormModel.role;
    }
  }

  isRoleSelected(role: String): boolean {
    return this.userFormModel.role==role;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}