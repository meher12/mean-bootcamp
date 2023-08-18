import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  newPost = 'NO CONTENT';
  updatePost: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;
  
  //@Output() postCreated = new EventEmitter<Post>();

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    // to get postId from url "edit/:postId"
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPostById(this.postId)
         .subscribe(postData => {
          this.isLoading = false;
           this.updatePost = {id: postData._id, title: postData.title, content: postData.content}
         });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  //Getting User Input
  /*
  onAddPost(postInput: HTMLTextAreaElement){
    console.log(postInput)
    this.newPost = postInput.value;
  }
  */
  // Getting User Input with ngModule
  onSavePost(form: NgForm) {
    
    if (form.invalid) {
      return;
    }
    /* const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postCreated.emit(post); */
    this.isLoading = true;
    if(this.mode === 'create'){
       this.postService.addPost(form.value.title, form.value.content);
    } else {
         this.postService.updatePost(
           this.postId,
           form.value.title,
           form.value.content
          );
    }
    // rest after send form
    form.resetForm();
  }
}
