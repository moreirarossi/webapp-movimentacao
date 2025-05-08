import { Component, OnInit } from '@angular/core';
import { MovimentoService } from 'app/services/movimento.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-movimento',
  templateUrl: './movimento.component.html',
  styleUrls: ['./movimento.component.css']
})
export class MovimentoComponent implements OnInit {
  displayedColumns: string[] = [
    'datMes',
    'datAno',
    'codProduto',
    'desProduto',
    'numLancamento',
    'desDescricao',
    'valValor'
  ];
  movimentos: any[] = [];

  constructor(
    private movimentoService: MovimentoService,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.movimentoService.buscarListaMovimentos().subscribe((data: any[]) => {
      this.movimentos = data;
      this.movimentoForm.disable();
    });
  }

  movimentoForm = this.fb.group({
    datMes: [null, [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
    datAno: [null, [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    codProduto: [null, Validators.required],
    codCosif: [null, Validators.required],
    valValor: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    desDescricao: [null, [Validators.required, Validators.maxLength(200)]],
  });

  produtos = [
    { codigo: 'P001', descricao: 'Produto 1' },
    { codigo: 'P002', descricao: 'Produto 2' }
  ];
  
  cosifs = [
    { codigo: 'C001', descricao: 'Cosif 1' },
    { codigo: 'C002', descricao: 'Cosif 2' }
  ];
  
  adicionarMovimento() {
    if (this.movimentoForm.invalid) return;
  
    const novoMovimento = this.movimentoForm.value;
    this.movimentos.push(novoMovimento);
    this.movimentos = [...this.movimentos];
    this.movimentoForm.reset();
  }

  novo() {
    this.movimentoForm.enable();
  }
  
  limpar() {
    this.movimentoForm.reset();
    this.movimentoForm.disable();
  }
}

