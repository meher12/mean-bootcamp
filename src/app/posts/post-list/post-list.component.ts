import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  
 /* 
  posts = [
   {title: 'First Post', content: 'This is the first post\'s content'},
    {title: 'Second Post', content: 'This is the second post\'s content'},
    {title: 'Third Post', content: 'This is the third post\'s content'}, 
  ];
*/

// @Input() posts: Post[] = [];
posts: Post[] = [];
private postSub: Subscription;
isLoading = false;

constructor(public postService: PostService) { }
 

  ngOnInit(): void {
    this.isLoading =true;
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListener()
     .subscribe((posts: Post[]) => {
       this.isLoading = false;
           this.posts = posts;
     });
  }

  // Delete post
  onDelete(postId: string){
    this.postService.deletePostById(postId);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

}
