import { DataService } from './../../data.service';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Post} from '../../post';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
myControl = new FormControl();
filteredOptions: Observable<string[]>;
allPosts: Post[];
autoCompleteList: any[];

@ViewChild('autocompleteInput')autocompleteInput: ElementRef;
@Output() onSelectedOption = new EventEmitter();
searchOptions:any;
  constructor( private dataService: DataService) {
   }

  ngOnInit() {
    // get all the posts
    this.dataService.getPosts().subscribe(posts => {
      this.allPosts = posts
      this.searchOptions = this.dataService.searchOption;
    });

    // when user types sth in input e value changes will come through this
    this.myControl.valueChanges.subscribe(userInput => {
      console.log('value changes' , userInput);
      this.autocompleteExpenseList(userInput);
    })
  }
  private autocompleteExpenseList(input: any) {
    console.log('autocomplete list', input);
    let categoryList = this.filterCategoryList(input);
    
    this.autoCompleteList = categoryList;
    console.log('autoCompleteList in autocomplete expense list', categoryList);
  }
  // this is where filtering the data happens according to you typed value
  filterCategoryList(val: any):any[] {
    console.log('filter category list', val);
    if(typeof val != "string"){
      return [];
    }
    if(val === '' || val === null){
      return [];
    }
    return val? this.allPosts.filter(p=>p.title.toLowerCase().indexOf(val.toLowerCase())>-1):this.allPosts;
  }

  // after you clicked an autosuggest option, this function will show the field you want to show in input
  displayFn(post: Post) {
    let k = post ? post.title : post;
    return k;
}

filterPostList(event) {
  console.log('mat list selection changed' , event.source.value);
  var posts = event.source.value;
  if (!posts) {
      this.dataService.searchOption = []
  }
  else {

      this.dataService.searchOption.push(posts);
      this.onSelectedOption.emit(this.dataService.searchOption)
      console.log('emit search option' , this.dataService.searchOption);
  }
  this.focusOnPlaceInput();
}
focusOnPlaceInput() {
  this.autocompleteInput.nativeElement.focus();
  this.autocompleteInput.nativeElement.value = '';
}

removeOption(option){
  let index = this.dataService.searchOption.indexOf(option);
  if(index>=0){
    this.dataService.searchOption.splice(index,1);
    this.focusOnPlaceInput();
    this.onSelectedOption.emit(this.dataService.searchOption);
  }
}

}
