import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';

@Component({
  selector: 'app-transactiondetail',
  templateUrl: './transactiondetail.component.html',
  styleUrls: ['./transactiondetail.component.scss']
})
export class TransactiondetailComponent implements OnInit {

  transaction: any;

  constructor(private route: ActivatedRoute,
    private db:DbConnectionService) { }

  ngOnInit(): void {

    // get url query params
    this.route.params.subscribe(params => {
      this.db.getTransaction(params.id).then(t => {
        this.transaction = t;
      })
    })
  }

}
