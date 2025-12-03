import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../Interfaces/Api-Response/api-response';
import { Idea, CreateIdeaDto } from '../../Interfaces/Idea/idea.interface';

@Injectable({
    providedIn: 'root',
})
export class IdeaService {
    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:5095/api/ideas';

    getIdeas(): Observable<ApiResponse<Idea[]>> {
        return this.http.get<ApiResponse<Idea[]>>(this.apiUrl);
    }

    getIdea(id: number): Observable<ApiResponse<Idea>> {
        return this.http.get<ApiResponse<Idea>>(`${this.apiUrl}/${id}`);
    }

    createIdea(idea: CreateIdeaDto): Observable<ApiResponse<Idea>> {
        return this.http.post<ApiResponse<Idea>>(this.apiUrl, idea);
    }
}
