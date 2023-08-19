import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  newPost = 'NO CONTENT';
  updatePost: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;
  
  //@Output() postCreated = new EventEmitter<Post>();

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
        title: new FormControl(null, {
         validators: [Validators.required, Validators.minLength(3)]
        }),
        content: new FormControl(null, {
          validators: [Validators.required]
         }),
         image: new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
         }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPostById(this.postId)
         .subscribe(postData => {
          this.isLoading = false;
           this.updatePost = {
               id: postData._id,
               title: postData.title,
               content: postData.content,
               imagePath: postData.imagePath
              };
              this.form.setValue({
                     title: this.updatePost.title,
                     content: this.updatePost.content,
                     image: this.updatePost.imagePath
                    });
         });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

  }

  // Getting User Input with ngModule
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
 
    this.isLoading = true;
    if(this.mode === 'create'){
       this.postService.addPost(
         this.form.value.title,
         this.form.value.content,
         this.form.value.image
        );
    } else {
         this.postService.updatePost(
           this.postId,
           this.form.value.title,
           this.form.value.content,
           this.form.value.image
          );
    }
    // rest after send form
    this.form.reset();
  }
}
