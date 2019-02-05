import { DataService } from './../../data.service';
import { Component, OnInit } from '@angular/core';
import {Post} from '../../post';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
posts : Post[];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getPosts().subscribe(posts => {
      this.posts = posts
      this.dataService.postData = posts
    });
  }
  onSelectedFilter(e){
    console.log('after emit')
    this.getFilteredExpenseList();
  }
  getFilteredExpenseList(){
    if (this.dataService.searchOption.length > 0){
    this.posts = this.dataService.filteredListOptions();
    console.log('inside getFilteredExpenseList' , this.posts);
    }
  else {
    this.posts = this.dataService.postData;
  }
  }

}
