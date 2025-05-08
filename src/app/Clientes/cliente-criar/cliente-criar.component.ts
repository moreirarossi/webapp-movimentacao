import { identifierName } from '@angular/compiler';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cliente-criar',
  templateUrl: './cliente-criar.component.html',
  styleUrls: ['./cliente-criar.component.css']
})
export class ClienteCriarComponent implements OnInit {

  tipoDocumento: string;
  tipoData: string;
  formCliente: FormGroup;
  maskCpfCnpj: string;
  cliente: any;

  constructor(private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ClienteCriarComponent>
  ) { }

  ngOnInit(): void {
    this.cliente = this.data.cliente;
    this.iniciarFormulario();
    if (this.cliente) {
      if (this.cliente.dataNascimento) {
        // Converte para um formato compatível
        this.cliente.dataNascimento = this.converterDataParaInputDate(this.cliente.dataNascimento);
      }
      this.formCliente.patchValue(this.cliente);
      this.selecionarTipo(this.cliente.tipo.toString());
    } 
   
  }

  iniciarFormulario() {

    this.formCliente = this._fb.group({
      id: [0],
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpfcnpj: ['', [Validators.required]],
      ie: [''],
      tipo: [1, [Validators.required]],
      dataNascimento: [new Date()],
      telefone: [''],
      cep: [''],
      logradouro: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      numero: [''],
      complemento: ['']
    });

    this.selecionarTipo(this.formCliente.value.tipo.toString());
  }

  onSubmit() {
    if (this.formCliente.valid) {
      this.formCliente.value.tipo = parseInt(this.formCliente.value.tipo);
      this.formCliente.value.cep = this.formCliente.value.cep.replace(/\D/g, '');
      this.dialogRef.close(this.formCliente.value); // Retorna o valor do formulário ao fechar
    } else {
      console.log('Formulário inválido. Corrija antes de confirmar.');
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  converterDataParaInputDate(data: any): string {
    if (!data) return ''; // Caso não haja data, retorna string vazia
  
    let dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return ''; // Se a data for inválida, retorna string vazia
    }
  
    return dataObj.toISOString().split('T')[0]; // Retorna no formato "YYYY-MM-DD"
  }
  
  // Função para definir a máscara dinamicamente
  public cpfCnpjMask = (rawValue: string): string => {
    // Remove tudo que não seja dígito
    const numbers = rawValue.replace(/\D/g, '');
    // Se os números forem até 11 dígitos, trata como CPF, caso contrário, como CNPJ
    return numbers.length <= 11 ? '000.000.000-00' : '00.000.000/0000-00';
  };

  selecionarTipo(tipo: string): void {
    
    if (tipo === '1') {
      this.tipoDocumento = 'CPF';
      this.tipoData = 'Data Nascimento';
      this.maskCpfCnpj = '000.000.000-00';
      this.formCliente.get('ie').disable();
      this.formCliente.get('ie').setValue('');
    } else if (tipo === '2') {
      this.tipoDocumento = 'CNPJ';
      this.tipoData = 'Data Abertura';
      this.maskCpfCnpj = '00.000.000/0000-00';
      this.formCliente.get('ie').enable();
    } else {
      this.maskCpfCnpj = '';
    }
  }

}
