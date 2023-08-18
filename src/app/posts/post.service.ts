import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}
  // Get all post
  getPosts() {
    //return [...this.posts];
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      // to remove _ from id
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  //Get post by id
  getPostById(id: string){
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  // Create a post
  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((resposeData) => {
        console.log(resposeData.message);
        const id = resposeData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  // Update Post
  updatePost(id: string, title: string, content: string){
    const post: Post = { id: id, title: title, content: content };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
     .subscribe(response => {
       console.log(response);
       const updatedPosts = [...this.posts];
       const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
       updatedPosts[oldPostIndex] = post;
       this.posts = updatedPosts;
       this.postsUpdated.next([...this.posts]);
       this.router.navigate(["/"]);
      });
  }

  // Delete post by id
  deletePostById(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        console.log('Deleted!');
        this.postsUpdated.next([...this.posts]);
      });
  }
}
