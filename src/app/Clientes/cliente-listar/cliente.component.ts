import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClienteService } from 'app/services/cliente.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; // Importar o NgbModal
import { ClienteCriarComponent } from '../cliente-criar/cliente-criar.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { ConfirmacaoDialog } from 'app/shared/dialog/confirmacao-dialog.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit, AfterViewInit {

  modalReference: NgbModalRef; // Referência do modal
  isEditMode: boolean;
  formCliente: any;
  displayedColumns: string[] = ['tipo', 'nome', 'documento', 'data', 'telefone', 'email', 'acao'];
  public clientes = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  filtroForm: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private _fb: FormBuilder,
    private modalService: NgbModal,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.buscarClientes();
    this.iniciarFormulario();
  }
  getTipoDescricao(tipo: number): string {
    return tipo === 1 ? 'Física' : 'Jurídica';
  }
  
  formatarDocumento(tipo: number, documento: string): string {
    if (!documento) return ''; // Se for vazio, retorna string vazia
  
    let docLimpo = documento.replace(/\D/g, ''); // Remove tudo que não for número
  
    if (tipo === 1 && docLimpo.length === 11) {
      // Formatar CPF: 000.000.000-00
      return docLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } 
    else if (tipo === 2 && docLimpo.length === 14) {
      // Formatar CNPJ: 00.000.000/0000-00
      return docLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  
    return documento; // Se não for CPF nem CNPJ válido, retorna como está
  }

  formatarData(data: string): string {
    if (!data) return ''; // Se não houver data, retorna string vazia
  
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) return data; // Se a data for inválida, retorna como está
  
    return dataObj.toLocaleDateString('pt-BR'); // Retorna no formato DD/MM/AAAA
  }
  
  iniciarFormulario() {
    
    this.clientes = new MatTableDataSource();
    this.clientes.paginator = this.paginator;

    this.filtroForm = this._fb.group({
      tipo: new FormControl(''),
      nome: new FormControl(''),
      cpfcnpj: new FormControl(''),
      telefone: new FormControl('')
    });
  }

  // Criar um metodo para buscar os Clientes
  buscarClientes() {
    this.clienteService.buscarListaClientes().subscribe((data: any[]) => {
      this.clientes.data = data;
      this.clientes.sort = this.sort;
      this.clientes.paginator = this.paginator;
    });
  }

  // Criar um metodo para buscar apenas um Cliente
  buscarCliente(id: number) {
    this.clienteService.buscarCliente(id).subscribe((data: any) => {
      console.log(data);
    });
  }

  limparFiltros() {
    this.filtroForm.reset();
    this.buscarClientes(); // Limpa e atualiza a lista
  }
    
  excluirCliente(cliente: any) {
    this.deletarCliente(cliente.id);
    console.log('Cliente excluído:', cliente);
  }

  deletarCliente(id: number) {
    this.clienteService.deletarCliente(id).subscribe((data: any) => {
      console.log(data);
      this.buscarClientes();
    });
  }
  
  confirmarExclusao(cliente: any) {
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      width: '350px',
      data: { nome: cliente.nome }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletarCliente(cliente.id);
      }
    });
  }

  onSubmit(): void {
    if (this.formCliente.valid) {
      if (this.isEditMode) {
        console.log('Cliente editado:', this.formCliente.value);
      } else {
        console.log('Cliente criado:', this.formCliente.value);
      }
      this.modalReference.close(); // Fechar o modal após salvar os dados
    }
  }

  // Criar um metodo para criar um Cliente
  criarCliente(cliente: any) {
    this.clienteService.criarCliente(cliente).subscribe((data: any) => {
      console.log(data);
      this.buscarClientes();
    });
  }
  
  novoCliente() {
    const dialogRef = this.dialog.open(ClienteCriarComponent, {
      width: '50%',
      height: 'auto',
      disableClose: true,
      data: { title: 'Novo Cliente'},
    });

    // Utilize 'afterClosed()' para capturar o resultado ao fechar o modal
    dialogRef.afterClosed().subscribe((res: any) => {
      // Verifica se o modal retornou algum resultado
      if (res) {
        this.criarCliente(res); // Chama o método para criar o cliente
        console.log('Cliente criado:', res);
      } else {
        console.warn('Modal fechado sem retorno.');
      }
    });
  }

  // Criar um metodo para atualizar um Cliente
  atualizarCliente(cliente: any) {
    this.clienteService.atualizarCliente(cliente).subscribe((data: any) => {
      console.log(data);
      this.buscarClientes();
    });
  }

  editarCliente(cliente: any) {
    const dialogRef = this.dialog.open(ClienteCriarComponent, {
      width: '50%',
      height: 'auto',
      disableClose: true,
      data: { title: 'Editar Cliente', cliente: cliente},
    });

    // Utilize 'afterClosed()' para capturar o resultado ao fechar o modal
    dialogRef.afterClosed().subscribe((res: any) => {
      // Verifica se o modal retornou algum resultado
      if (res) {
        this.atualizarCliente(res); // Chama o método para criar o cliente
        console.log('Cliente criado:', res);
      } else {
        console.warn('Modal fechado sem retorno.');
      }
    });
  }
  

  ngAfterViewInit(): void {
    this.clientes.sort = this.sort;
    this.clientes.paginator = this.paginator;
  }

}