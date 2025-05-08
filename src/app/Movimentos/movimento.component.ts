import { Component, OnInit } from '@angular/core';
import { MovimentoService } from 'app/services/movimento.service';
import { ProdutoService } from 'app/services/produto.service';
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
  produtos: any[] = [];
  cosifs: any[] = [];

  constructor(
    private movimentoService: MovimentoService,
    private produtoService: ProdutoService,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.movimentoService.buscarListaMovimentos().subscribe((data: any[]) => {
      this.movimentos = data;
      this.movimentoForm.disable();
    });
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

