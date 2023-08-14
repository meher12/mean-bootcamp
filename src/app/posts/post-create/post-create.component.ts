import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  onAddPost(form: NgForm){
    if(form.invalid){
      return;
    }
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postCreated.emit(post);
  }

}
