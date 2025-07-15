import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Importez vos services ArticleService et CategoryService ici
// import { ArticleService } from '../../services/article.service';
// import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-article-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {
  article: any = { titre: '', description: '', categorieId: null }; // Remplacez 'any' par votre interface Article
  categories: any[] = []; // Remplacez 'any' par votre interface Categorie
  isEditMode: boolean = false;
  articleId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private articleService: ArticleService,
    // private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    // Charger les catégories (pour le sélecteur)
    this.loadCategories();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.articleId = +id;
        this.loadArticle(this.articleId);
      }
    });
  }

  loadCategories(): void {
    // this.categoryService.getCategories().subscribe(data => {
    //   this.categories = data;
    // });
    this.categories = [
      { id: 1, nom: 'Technologie' },
      { id: 2, nom: 'Santé' },
      { id: 3, nom: 'Éducation' },
    ];
  }

  loadArticle(id: number): void {
    // this.articleService.getArticleById(id).subscribe(data => {
    //   this.article = data;
    //   this.article.categorieId = data.categorie.id; // Assurez-vous que l'ID de la catégorie est bien mappé
    // });

    // Données factices pour l'exemple
    const dummyArticle = { id: 1, titre: 'Article à Modifier', description: 'Ceci est la description de l\'article à modifier.', categorie: { id: 1, nom: 'Technologie' } };
    this.article = { ...dummyArticle, categorieId: dummyArticle.categorie.id };
  }

  saveArticle(): void {
    if (this.isEditMode) {
      // this.articleService.updateArticle(this.articleId!, this.article).subscribe(() => {
      //   alert('Article modifié avec succès !');
      //   this.router.navigate(['/editor/articles']);
      // });
      console.log('Modification article:', this.article);
      alert('Article modifié (simulation) !');
      this.router.navigate(['/editor/articles']);
    } else {
      // this.articleService.addArticle(this.article).subscribe(() => {
      //   alert('Article ajouté avec succès !');
      //   this.router.navigate(['/editor/articles']);
      // });
      console.log('Ajout article:', this.article);
      alert('Article ajouté (simulation) !');
      this.router.navigate(['/editor/articles']);
    }
  }

  goBack(): void {
    this.router.navigate(['/editor/articles']);
  }
}