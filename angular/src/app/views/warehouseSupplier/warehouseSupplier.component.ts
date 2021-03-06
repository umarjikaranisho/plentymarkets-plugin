import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import { Language, TranslationService } from 'angular-l10n';
import { WarehouseSupplierService } from '../../core/services/warehouseSupplier/warehouseSupplier.service';
import { WarehouseService } from '../../core/services/warehouse/warehouse.service';

@Component({
    selector: 'warehouse-supplier',
    template: require('./warehouseSupplier.component.html'),
    styles: [require('./warehouseSupplier.component.scss')],
})
export class WarehouseSupplierComponent implements OnInit {
    @Language()
    public lang: string;

    public warehouseSuppliers = [];

    public removedWarehouseSuppliers = [];

    public warehouses = [];

    public status = { type: null, value: null };

    constructor(private warehouseService: WarehouseService, private warehouseSupplierService: WarehouseSupplierService, private translation:TranslationService) {
    }

    public ngOnInit(): void {
        this.warehouseService.fetch()
            .subscribe(data => {
                this.warehouses = data
            }, err => {
                this.status.type = 'text-danger'
                this.status.value = this.translation.translate('error_fetch')
            })

        this.warehouseSupplierService.fetchMappings()
            .subscribe(data => {
                this.warehouseSuppliers = data
            }, err => {
                this.status.type = 'text-danger'
                this.status.value = this.translation.translate('error_fetch')
            })
    }

    public saveMappings(): void {
        let self = this
        let validated = true
        this.warehouseSuppliers.forEach((item) => {
            // Check if any value is empty.
            if (Object.values(item).some(itemValue => !itemValue)) {
                self.status.type = 'text-danger'
                self.status.value = this.translation.translate('empty_values_mapping')
                validated = false
            }
        })
        if(!validated) return;
        if (this.warehouseSuppliers.length > 0 || this.removedWarehouseSuppliers.length > 0) {
            this.status.type = 'text-info'
            this.status.value = this.translation.translate('saving_status')
            let data = this.removedWarehouseSuppliers.concat(this.warehouseSuppliers);
            this.warehouseSupplierService.postMappings(data).subscribe(data => {
                this.status.type = 'text-info'
                this.status.value = this.translation.translate('saved')
            }, err => {
                this.status.type = 'text-danger'
                this.status.value = this.translation.translate('error_save')
            });
        } else {
            this.status.type = 'text-info'
            this.status.value = this.translation.translate('nothing_to_save')
        }
    }

    public addMapping(): void {
        this.warehouseSuppliers.push({
            supplierId: null,
            warehouseId: null
        })
    }

    public removeMapping(warehouseSupplier): void {
        let foundIndex = this.warehouseSuppliers.findIndex((elem, idx) => {
            return elem.supplierId == warehouseSupplier.supplierId && elem.warehouseId == warehouseSupplier.warehouseId;
        })
        let targetWarehouseSupplier = this.warehouseSuppliers[foundIndex]
        if(targetWarehouseSupplier.supplierId && targetWarehouseSupplier.warehouseId){
            targetWarehouseSupplier.removed = true
            this.removedWarehouseSuppliers.push(targetWarehouseSupplier)
        }
        this.warehouseSuppliers.splice(foundIndex, 1);
    }
}
