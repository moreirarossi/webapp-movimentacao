import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movimento } from 'app/Model/movimento.model';
import { MovimentoResponse } from 'app/Model/movimento-response.model';

@Injectable({
  providedIn: 'root'
})
export class MovimentoService {

  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  buscarListaMovimentos(): Observable<MovimentoResponse[]> {
    return this.http.get<MovimentoResponse[]>(`${this.apiUrl}/Movimentos`).pipe(
      catchError(this.handleError)
    );
  }

  criarMovimento(movimento: Movimento): Observable<Movimento> {
    return this.http.post<Movimento>(`${this.apiUrl}/Movimentos`, movimento).pipe(
      catchError(this.handleError)
    );
  }

  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}, Mensagem: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
