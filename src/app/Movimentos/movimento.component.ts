import { Component, OnInit } from '@angular/core';
import { MovimentoService } from 'app/services/movimento.service';
import { ProdutoService } from 'app/services/produto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Movimento } from '../Model/movimento.model';

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
  movimentosResponse: any[] = [];
  produtos: any[] = [];
  cosifs: any[] = [];

  constructor(
    private movimentoService: MovimentoService,
    private produtoService: ProdutoService,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.carregarMovimentos();
    this.produtoService.buscarListaProdutos().subscribe((produtos: any[]) => {
    this.produtos = produtos;
    });
    this.movimentoForm.get('codProduto')?.valueChanges.subscribe(codProduto => {
      if (codProduto) {
        this.produtoService.buscarListaCosifs(codProduto).subscribe(cosifs => {
          this.cosifs = cosifs;
        });
      }
    });
  }

  carregarMovimentos() {
    this.movimentoService.buscarListaMovimentos().subscribe((data: any[]) => {
      this.movimentosResponse = data;
    });
  }

  movimentoForm = this.fb.group({
    datMes: [null, [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
    datAno: [null, [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    codProduto: [null, Validators.required],
    codCosif: [null, Validators.required],
    valValor: [null as string | null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    desDescricao: [null, [Validators.required, Validators.maxLength(200)]],
  });
 
  adicionarMovimento() {
    if (this.movimentoForm.invalid) return;
  
    const novoMovimento: Movimento = {
      datMes: Number(this.movimentoForm.value.datMes),
      datAno: Number(this.movimentoForm.value.datAno),
      codProduto: String(this.movimentoForm.value.codProduto),
      codCosif: String(this.movimentoForm.value.codCosif),
      desDescricao: String(this.movimentoForm.value.desDescricao),
      valValor: Number(this.movimentoForm.value.valValor),
    };
  
    this.movimentoService.criarMovimento(novoMovimento).subscribe({
      next: (movimentoSalvo) => {
        this.movimentosResponse.push(movimentoSalvo);
        this.movimentosResponse = [...this.movimentosResponse];
        this.movimentoForm.reset();
        this.movimentoForm.disable();
        this.carregarMovimentos();
      },
      error: (err) => {
        console.error('Erro ao salvar movimento:', err);
      }
    });
  }

  novo() {
    this.movimentoForm.enable();
  }
  
  limpar() {
    this.movimentoForm.reset();
    this.movimentoForm.disable();
  }

  formatarValor(): void {
    let rawValue = this.movimentoForm.get('valValor')?.value || '';
    rawValue = rawValue.replace(/\D/g, ''); // Remove não dígitos
  
    if (rawValue.length === 0) {
      this.movimentoForm.get('valValor')?.setValue('');
      return;
    }
  
    const valor = (parseInt(rawValue, 10) / 100).toFixed(2);
    this.movimentoForm.get('valValor')?.setValue(valor, { emitEvent: false });
  }
}

