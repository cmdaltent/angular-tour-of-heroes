import { Injectable } from '@angular/core';
import {Hero} from "./hero";
import {catchError, Observable, of, tap} from "rxjs";
import {MessageService} from "./message.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>('api/heroes').pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero | undefined> {
    return this.http.get<Hero>(`/api/heroes/${id}`).pipe(
      tap(_ => this.log(`fetched hero with id '${id}'`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  updateHero(hero: Hero): Observable<unknown> {
    return this.http.put('/api/heroes', hero, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(_ => this.log(`updated hero with id '${hero.id}'`)),
      catchError(this.handleError<unknown>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>('/api/heroes', hero, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap((newHero: Hero) => this.log(`added hero with id '${newHero.id}'`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
}
