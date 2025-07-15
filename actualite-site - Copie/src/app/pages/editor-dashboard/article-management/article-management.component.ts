import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../service/article.service';
import { Article } from '../../../model/article.service';

@Component({
  selector: 'app-article-management',
  imports: [RouterModule, MatIconModule,CommonModule],
  templateUrl: './article-management.component.html'
})
export class ArticleManagementComponent implements OnInit {
  articles: Article[] = []; 

  constructor(private articleService:ArticleService) { }

  ngOnInit(): void {
    this.loadArticles();
    console.log('Articles chargés:', this.articles);
  }

  loadArticles(): void {
    this.articleService.getAllArticles().subscribe((data: Article[]) => {
      this.articles = data;

    }); // Assurez-vous que cette méthode existe dans votre service
  }

  deleteArticle(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.articleService.deleteArticle(id).subscribe({ 
        next: () => {
          alert('Article supprimé avec succès !');
          this.loadArticles(); // Rechargez les articles après la suppression
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'article:', error);
          alert('Une erreur est survenue lors de la suppression de l\'article.');
        }
      });
    }
  }

  
}