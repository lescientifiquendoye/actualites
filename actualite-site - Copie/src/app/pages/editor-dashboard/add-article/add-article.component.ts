// src/app/add-article/add-article.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ArticleService } from '../../../service/article.service';
// Import Article (your model class, not the service) if it's the expected response type
// For now, using 'any' for response type to avoid import issues if not explicitly defined
// import { Article } from '../../../model/article'; // Assuming you have an Article model
import { Categorie } from '../../../model/categorie.service'; // Assuming Categorie is a model
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { CategorieService } from '../../../service/categorie.service';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { Article } from '../../../model/article.service';

// Define an interface for the DTO expected by the backend Spring for creation/update
interface ArticlePayload {
  titre: string;
  description: string;
  contenu: string;
  date: string; // Date sent as YYYY-MM-DD string
  categorieId: number;
}

@Component({
  selector: 'app-add-article',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {
  @ViewChild('articleForm') articleForm!: NgForm;

  // newArticle will now also hold the data of the article being edited
  newArticle: any = {
    id: null, // Change to null for potential new articles, or the ID for existing ones
    titre: '',
    description: '',
    contenu: '',
    date: new Date().toISOString().substring(0, 10),
    categorie: undefined!,
    categorieId: 0,
  };

  categories: Categorie[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  isEditMode: boolean = false; // Flag to indicate if we are in edit mode

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute, // Inject ActivatedRoute
    private articleService: ArticleService,
    private categorieService: CategorieService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.activatedRoute.paramMap.subscribe(params => {
      const articleId = params.get('id');
      if (articleId) {
        this.isEditMode = true;
        this.loadArticle(Number(articleId)); // Load existing article data
      }else {
        
      }
    });
  }

  loadCategories(): void {
    this.categorieService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
  }

  // New method to load an existing article for editing
  loadArticle(id: number): void {
    this.articleService.getArticleById(id).subscribe(
      (article: Article) => { 
        this.newArticle = {
          id: article.id,
          titre: article.titre,
          description: article.description,
          contenu: article.contenu,
          // Ensure date is in YYYY-MM-DD format for the input field
          date: article.date ? new Date(article.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
          categorie: article.categorie, // Keep the full category object if needed for display
          categorieId: article.categorie ? article.categorie.id : 0 // Set selected category ID
        };

        setTimeout(() => {
          if (this.articleForm) {
            this.articleForm.resetForm(this.newArticle);
          }
        }, 0);
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'article :', error);
        this.errorMessage = 'Erreur lors du chargement de l\'article. Veuillez réessayer.';
        this.isEditMode = false; // Revert to add mode if load fails
      }
    );
  }

  // Consolidated method for adding or updating an article
  saveArticle(): void { // Renamed from addArticle to reflect dual purpose
    this.successMessage = '';
    this.errorMessage = '';

    const payload: ArticlePayload = {
      titre: this.newArticle.titre,
      description: this.newArticle.description,
      contenu: this.newArticle.contenu,
      date: this.newArticle.date,
      categorieId: this.newArticle.categorieId
    };

    if (this.isEditMode && this.newArticle.id) {
      // If in edit mode and article ID exists, call update
      this.articleService.updateArticle(this.newArticle.id, payload).subscribe(
        (response: any) => {
          this.successMessage = 'Article mis à jour avec succès ! ID: ' + response.id;
          this.resetForm();
          this.goBack();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'article :', error);
          this.errorMessage = 'Erreur lors de la mise à jour de l\'article. Veuillez réessayer.';
          if (error.error && typeof error.error === 'string') {
            this.errorMessage += ` Détails: ${error.error}`;
          }
        }
      );
    } else {
      // Otherwise, call add for new article
      this.articleService.addArticle(payload).subscribe(
        (response: any) => {
          this.successMessage = 'Article ajouté avec succès ! ID: ' + response.id;
          this.resetForm();
          this.goBack();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'article :', error);
          this.errorMessage = 'Erreur lors de l\'ajout de l\'article. Veuillez réessayer.';
          if (error.error && typeof error.error === 'string') {
            this.errorMessage += ` Détails: ${error.error}`;
          }
        }
      );
    }
  }

  goBack(): void {
    // Navigate back to a list view or dashboard
    this.router.navigate(['/editeur/articles']); // Adjust this path as needed
  }

  resetForm(): void {
    this.newArticle = {
      id: null, // Reset ID to null for a new article
      titre: '',
      description: '',
      contenu: '',
      date: new Date().toISOString().substring(0, 10),
      categorie: undefined!,
      categorieId: 0,
    };
    if (this.articleForm) {
      this.articleForm.resetForm(this.newArticle);
    }
    this.successMessage = '';
    this.errorMessage = '';
    this.isEditMode = false; // Reset to add mode after form reset
  }
}