import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DbConnectionService } from '../services/db-connection.service';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-taxonomy',
  templateUrl: './taxonomy.component.html',
  styleUrls: ['./taxonomy.component.scss']
})
export class TaxonomyComponent implements OnInit {

  taxonomy = {};
  // company: string;
  taxonomyForm: UntypedFormGroup;
  propertyValuesFormArray: UntypedFormArray;
  companies: any;
  companyName: string;
  constraints: any;
  showPopup = false;


  constructor(
    private db: DbConnectionService,
    private formBuilder: UntypedFormBuilder,
    private companyService:CompanyService
  ) {
    this.taxonomyForm = this.formBuilder.group({
      dimensionValue: this.formBuilder.array([])

    })
    
  }

  ngOnInit(): void {
    this.fetchCompany();

    this.propertyValuesFormArray = this.taxonomyForm.get('dimensionValue') as UntypedFormArray;

    // this.db.getSelectedCompany().then(data =>
    //   {this.company = Object.values(data)[0]})

    // this.db.getCompanies().then(data =>
    //   (this.companies = data))
    this.fetchConstraints()
    //this.fetchTaxonomy()

  }



  fetchTaxonomy() {
    this.db.getTaxonomy()
      .then(taxonomy => {
        taxonomy['taxonomy'].forEach(x => {
          if (x.dimension in this.taxonomy) {
            this.taxonomy[x.dimension].push({ value: x.dimensionValue, selected: x.selected, exclusive: x.exclusive, selectable: 1 })
          }
          else {
            this.taxonomy[x.dimension] = [{ value: x.dimensionValue, selected: x.selected, exclusive: x.exclusive, selectable: 1 }]
            this.taxonomy[x.dimension]['mandatory'] = x.mandatory;
            this.taxonomy[x.dimension]['orderNr'] = x.orderNrDimension
            this.taxonomy[x.dimension]['description'] = x.description
          }
          if (x.selected) {
            this.propertyValuesFormArray.push(new UntypedFormControl(x.dimensionValue));
          }
        })

        for (const [dimension, values] of Object.entries(this.taxonomy)) {
          (values as any).forEach(value => {
            if (value.selected) {
              this.checkDependencyConstraint(value)
              this.checkExclusiveConstraint(dimension, value)
            }
          })
        }

      })
  }

  fetchConstraints() {
    this.db.getConstraints().then(r => {
      this.constraints = r['constraints']
    })
  }

  checkDependencyConstraint(value) {
    if (typeof this.constraints !== 'undefined' && Array.isArray(this.constraints)) {
      this.constraints.forEach(constraint => {

        if (constraint.value === value.value) {

          const index = this.taxonomy[constraint.dimension].findIndex(cv => cv.value === constraint.constraintsValue)
          if (index !== -1) {
            if (value.selected) {
              this.taxonomy[constraint.dimension][index].selectable = 0
              this.taxonomy[constraint.dimension][index].selected = 0
              this.taxonomy[constraint.dimension][index]['dependency'] = 1
              this.db.deleteProperty(this.companyName, this.taxonomy[constraint.dimension][index].value)
            }
            else {
              this.taxonomy[constraint.dimension][index].selectable = 1
            }

          }
        }
      })
    }
  }

  checkExclusiveConstraint(dimension, value) {
    if (value.exclusive) {
      this.taxonomy[dimension].forEach(v => {
        if (v.value !== value.value) {
          if (value.selected) {
            v.selectable = 0;
            if (v.selected) {
              v.selected = 0
              this.db.deleteProperty(this.companyName, v.value)
            }
          }
          else {
            v.selectable = 1;
          }
        }
      });
    }
  }


  onCheckboxChange(e, value: any, dimension) {
    if (e.target.checked) {
      this.propertyValuesFormArray.push(new UntypedFormControl(e.target.value));
      this.db.createProperty(this.companyName, e.target.value)
      // this.db.executeQuery(`INSERT INTO PropertyCompany (company, property) values ('${this.companyName}','${e.target.value}');`)
      value.selected = 1
    } else {
      const index = this.propertyValuesFormArray.controls.findIndex(x => x.value === e.target.value);
      this.propertyValuesFormArray.removeAt(index);
      value.selected = 0
      // this.db.executeQuery(`DELETE FROM PropertyCompany WHERE company = '${this.companyName}' AND property = '${e.target.value}';`)
      this.db.deleteProperty(this.companyName, e.target.value)
    }
    this.checkDependencyConstraint(value)
    this.checkExclusiveConstraint(dimension, value) 
  }


  // async onCompanyChange(companyName) {
  //   this.taxonomy = {}
  //   // this.db.updateSelectedCompany(companyName)
  //   await this.db.executeQuery('update Company set selected = false where selected = true')
  //   if (companyName == "+ Add") {
  //     var newCompany = prompt("Please enter the name of the new platform company");
  //     await this.db.executeQuery(`insert into Company (name, selected) values ('${newCompany}', true)`)
  //     this.db.getCompanies().then(data =>
  //       (this.companies = data))
  //     this.companyName = newCompany
  //   }
  //   else {
  //     await this.db.executeQuery(`update Company set selected = true where name = '${companyName}'`)
  //   }
  //   this.fetchTaxonomy();

  // }


  // editTaxonomy() {
  //   // this.db.deleteProperties(this.company)
  //   //this.db.updateProperties(this.company, this.taxonomyForm.value['dimensionValue'])
  // }

  async fetchCompany() {
    this.companyName = this.companyService.companyName
    this.db.createCompany({company: this.companyName})
    // this.db.setCompany(this.companyName)
    // this.db.executeQuery('update Company set selected = false where selected = true')
    // this.db.executeQuery(`update Company set selected = true where name = '${this.companyService.companyName}'`)
    this.fetchTaxonomy();
  }

  checkMandatoryValues() {
    const missingDimensions = [];
    
    for (let d in this.taxonomy) {
      const values = this.taxonomy[d]
      if (values['mandatory']) {
        var sum = 0
        values.forEach(v => {
          sum = sum+v.selected
        })
        if (sum == 0) {
          missingDimensions.push(d)
        }
      }
    }

    if (missingDimensions.length > 0) {
      alert(`Please select a value for the following mandatory dimensions: ${missingDimensions.join(", ")}`);
    } else {
      alert("Saved");
    }
  }
}





