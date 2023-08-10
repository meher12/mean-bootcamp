import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {

  constructor() { }

  entredValue = '';
  newPost ='NO CONTENT';

  ngOnInit(): void {
  }

  //Getting User Input
  /*
  onAddPost(postInput: HTMLTextAreaElement){
    console.log(postInput)
    this.newPost = postInput.value;
  }
  */
 // Getting User Input with ngModule
  onAddPost(){
    this.newPost = this.entredValue;
  }

}
