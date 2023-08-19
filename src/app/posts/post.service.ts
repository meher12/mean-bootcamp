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
              imagePath: post.imagePath
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
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  // Create a post
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string, post: Post }>(
        'http://localhost:3000/api/posts', postData)
      .subscribe((resposeData) => {
        console.log(resposeData.message);
        const post: Post = {
          id: resposeData.post.id,
          title: title,
          content: content,
          imagePath: resposeData.post.imagePath
        };
     
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  // Update Post
  updatePost(id: string, title: string, content: string, image: File | string){
    let postData: Post | FormData;
    if(typeof(image) === 'object') {
       postData = new FormData();
       postData.append("id", id);
       postData.append("title", title);
       postData.append("content", content);
       postData.append("image", image, title);
    } else {
      postData = {
        id: id, 
        title: title, 
        content: content, 
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
     .subscribe(response => {
       console.log(response);
       const updatedPosts = [...this.posts];
       const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
       const post: Post = {
        id: id, 
        title: title, 
        content: content, 
        imagePath: ""
      };
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
