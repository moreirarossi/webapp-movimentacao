import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from 'app/Model/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  // Método para buscar todos os clientes
  buscarListaClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/Clientes`).pipe(
      delay(1000), // Em produção, remova esse delay
      catchError(this.handleError) // Tratamento de erros
    );
  }

   // Método para buscar um cliente pelo ID
  //  buscarClienteFitro(cliente: any): Observable<Cliente> {
  //   return this.http.get<Cliente>(`${this.apiUrl}/Clientes/${id}`).pipe(
  //     delay(1000), // Em produção, remova esse delay
  //     catchError(this.handleError) // Tratamento de erros
  //   );
  // }

  // Método para buscar um cliente pelo ID
  buscarCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/Clientes/${id}`).pipe(
      delay(1000), // Em produção, remova esse delay
      catchError(this.handleError) // Tratamento de erros
    );
  }

  // Método para criar um novo cliente
  criarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/Clientes`, cliente).pipe(
      delay(1000), // Em produção, remova esse delay
      catchError(this.handleError) // Tratamento de erros
    );
  }

  // Método para atualizar um cliente
  atualizarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/Clientes/${cliente.id}`, cliente).pipe(
      delay(1000), // Em produção, remova esse delay
      catchError(this.handleError) // Tratamento de erros
    );
  }

  // Método para deletar um cliente
  deletarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Clientes/${id}`).pipe(
      delay(1000), // Em produção, remova esse delay
      catchError(this.handleError) // Tratamento de erros
    );
  }

  // Método para tratar erros HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código do erro: ${error.status}, Mensagem: ${error.message}`;
    }

    // Retorna um observable com o erro
    return throwError(() => new Error(errorMessage));
  }
}
