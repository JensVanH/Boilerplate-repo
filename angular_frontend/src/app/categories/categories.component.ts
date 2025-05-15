import { Component, OnInit } from '@angular/core';
import { DbConnectionService } from '../services/db-connection.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  error: string;
  loading: boolean = false;
  categories = [];
  newOptionName: string[] = [""];
  newCategoryName: string = "";

  constructor(private db: DbConnectionService) {
    this.fetchCategories();
    }

  ngOnInit(): void {
  }

  // get categories
  fetchCategories(){
    this.db.getCategories().then(c => {
      this.categories = Object.entries(c)
      this.loading = false;
    }).catch(err => {
      this.error = err.error.message
      this.loading = false;
    })
  }

  // add new field of category
  addOption(categoryIndex: number){
    this.loading = true;
    let f = {name: this.newOptionName[categoryIndex]}
    f['type'] = this.categories[categoryIndex][0]
    this.db.createCategory(f).then(_ => {
      // update categories
      this.fetchCategories();
      this.newOptionName[categoryIndex] = "";
    }).catch(err => {
      this.error = err.error.message;
      this.loading = false;
    })
  }

  // add category (only locally)
  addCategory(){
    this.categories.push([this.newCategoryName, []])
    this.newCategoryName = "";
  }

  removeOption(categoryIndex: number, optionIndex: number){
    this.loading = true;
    this.db.deleteCategory(this.categories[categoryIndex][1][optionIndex]).then(_ => {
      // update categories
      this.fetchCategories();
    }).catch(err => {
      this.error = err.error.message
      this.loading = false;
    })
  }

  // remove all options in category
  removeCategory(categoryIndex: number){
    this.loading = true;
    this.db.deleteCategoryType(this.categories[categoryIndex][0]).then(_ => {
      // update categories
      this.fetchCategories();
    }).catch(err => {
      this.error = err.error.message
      this.loading = false;
    })
  }
}
