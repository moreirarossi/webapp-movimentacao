import { Component, OnInit } from '@angular/core';
import { MovimentoService } from 'app/services/movimento.service';

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

  constructor(private movimentoService: MovimentoService) {}

  ngOnInit(): void {
    this.movimentoService.buscarListaMovimentos().subscribe((data: any[]) => {
      this.movimentos = data;
    });
  }
}
