import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { ITypes, data } from "../../constants/data";
import { FormsModule } from "@angular/forms";


@Component({
    selector: 'category-computer-popup',
    templateUrl: './category-computer-popup.html',
    styleUrls: ['./category-computer-popup.css'],
    imports: [FormsModule],
    encapsulation: ViewEncapsulation.None
})

export class CategoryComputerPopupComponent {
    @Input() data: ITypes['CategoryComputer'] | null = null;
    @Output() save = new EventEmitter<ITypes['CategoryComputer']>();
    @Output() close = new EventEmitter<void>();

    form: ITypes['CategoryComputer'] = { ...data.CategoryComputer };

    ngOnChanges() {
        if (this.data) {
            this.form = { ...this.data };
        } else {
            this.form = { ...data.CategoryComputer };
        }
    }

    submit() {
        console.log('Submitting form:', this.form);
        this.save.emit(this.form);
    }
}