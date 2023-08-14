import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {

  constructor() { }

  entredTile = '';
  entredContent = '';
  newPost ='NO CONTENT';
  @Output() postCreated = new EventEmitter<Post>();

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
    const post: Post = {
      title: this.entredTile,
      content: this.entredContent
    };
    this.postCreated.emit(post);
  }

}
