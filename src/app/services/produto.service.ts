import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Produto } from 'app/Model/produto.model';
import { Cosif } from 'app/Model/cosif.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  buscarListaProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/Produtos`).pipe(
      catchError(this.handleError)
    );
  }

  buscarListaCosifs(codProduto: string): Observable<Cosif[]> {
    return this.http.get<Cosif[]>(`${this.apiUrl}/Produtos/${codProduto}/cosif`).pipe(
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
