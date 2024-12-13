import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-stock-add',
  standalone: true,
  imports: [],
  templateUrl: './product-stock-add.component.html',
  styleUrls: ['./product-stock-add.component.css']
})

export class ProductStockAddComponent implements OnInit {
  
  paramProductCode: string;
  paramProductId: number;

  constructor(
    private route:ActivatedRoute,
  ){}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productCode = params.get('productCode');
      const productId = params.get('productId');
      this.paramProductCode = productCode;
      this.paramProductId = Number(productId);
    });

    console.log('Code = '+this.paramProductCode+ ' id = ', this.paramProductId);

  }


}
