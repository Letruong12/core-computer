import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";



@Component({
    selector: 'user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user.component.css'],
    imports: [CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})
export class UserPopupComponent {
    @Input() data: any | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<any>();

    form: any = {};

    ngOnChanges() {
        if (this.data) {
            this.form = { ...this.data };;
        } else {
            this.form = {};
        }
    }

    closemit() {
        this.close.emit();
    }

    savemit() {
        this.save.emit(this.form);
    }
}