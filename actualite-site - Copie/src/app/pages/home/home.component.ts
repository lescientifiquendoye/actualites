import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../service/article.service';
import { Article } from '../../model/article.service';
import { Categorie } from '../../model/categorie.service';
import { CategorieService } from '../../service/categorie.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {MatIconModule } from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink,MatIconModule,FormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
gotoAdmin() {
    window.location.href = '/editeur-dashboard';
  
}
filterByCategory() {
  console.log('Selected Category:', this.selectedCategory);
    if (this.selectedCategory) {
      this.articleService.getArticlesByCategorie(this.selectedCategory).subscribe(data => {
        this.articles = data;
        this.currentPage = 1; // Reset to the first page
        this.article = this.articles[0]; // Set the first article as the main article
      });
    } else {
      this.articleService.getAllArticles().subscribe(data => {
        this.articles = data;
        this.currentPage = 1; // Reset to the first page
        this.article = this.articles[0]; // Set the first article as the main article
      });
    }
}
    ngOnInit(): void {
    this.articleService.getAllArticles().subscribe(data => {
      this.articles = data;
      this.article= this.articles[this.currentPage]; // Set the first article as the main article
    });
    this.categorieservice.getAllCategories().subscribe(data => {
      this.categories = data;
    });


  }

article ?: Article;
currentPage: number = 1;
categories: Categorie[] = []; // Liste de toutes les catégories disponibles
selectedCategory: string = ''; // ID de la catégorie sélectionnée (vide pour 'Toutes')
articles: Article[] = [];

hasMoreArticles(): boolean {
  return this.currentPage < this.articles.length ;
}
nextPage() {
 this.currentPage++;
 this.article= this.articles[this.currentPage-1]; // Update the article to display
  // if (this.currentPage >= this.articles.length) {
  //   this.currentPage = this.articles.length - 1; // Prevent going out of bounds
  // } else {
  //   this.article = this.articles[this.currentPage]; // Update the article to display
  // }
}
previousPage() {
  this.currentPage--;

  if (this.currentPage < 1) {
    this.currentPage = 1;
  }
  this.article = this.articles[this.currentPage-1]; // Update the article to display
}

  constructor(private articleService: ArticleService,private authService: AuthService,private categorieservice : CategorieService) {}
}
