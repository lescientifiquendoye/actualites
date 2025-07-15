import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../service/article.service';
import { Article } from '../../model/article.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categorie',
  imports: [CommonModule,RouterLink],
  templateUrl: './categorie.component.html'
})
export class CategorieComponent implements OnInit {
  articles: Article[] = [];
  nomCategorie = '';

  constructor(private route: ActivatedRoute, private articleService: ArticleService) {}

  ngOnInit(): void {
    this.nomCategorie = this.route.snapshot.paramMap.get('nom') || '';
    this.articleService.getArticlesByCategorie(this.nomCategorie).subscribe(data => {
      this.articles = data;
    });
  }
}
