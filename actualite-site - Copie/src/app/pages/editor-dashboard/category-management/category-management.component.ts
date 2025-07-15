import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { CategorieService } from '../../../service/categorie.service';
import { Categorie } from '../../../model/categorie.service';
// Importez votre service CategoryService ici
// import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-management',
  imports: [FormsModule, RouterLink, CommonModule, MatIconModule],
  templateUrl: './category-management.component.html',
})
export class CategoryManagementComponent implements OnInit {
  categories: Categorie[] = []; // Remplacez 'any' par votre interface Categorie réelle

  constructor( private categoryService: CategorieService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((data: Categorie[]) => {
      this.categories = data;
    }); // Assurez-vous que cette méthode existe dans votre service
  }

  deleteCategory(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible et pourrait affecter les articles associés.')) {
      
      this.categoryService.deleteCategory(id).subscribe((value) => {
        alert('Catégorie supprimée (simulation) !');
        this.loadCategories(); // Rechargez les catégories après la suppression
      }, error => {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        alert('Une erreur est survenue lors de la suppression de la catégorie.');
      });
    
    }
  }
}