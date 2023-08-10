import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  constructor() { }

  newPost ='';

  ngOnInit(): void {
  }

  onAddPost(postInput: HTMLTextAreaElement){
    console.log(postInput)
    this.newPost = 'The user \'s post';
  }

}
