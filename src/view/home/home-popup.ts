import { Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { data, ITypes } from "../../constants/data";
import { env } from "../../env/env";
import { AuthService } from "../../services/api-service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'home-popup',
    templateUrl: './home-popup.html',
    styleUrls: ['../view-home-style.css'],
    imports: [CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})
export class HomePopupComponent implements OnInit {

    @Input() data: ITypes['Computer'] | null = null;
    @Output() onAddToCart = new EventEmitter<string | null>();
    @Output() close = new EventEmitter<void>();

    private serviceAuth = inject(AuthService);

    form: ITypes['Computer'] = { ...data.Computer };

    baseUrl = env.baseUrl;
    private user: any = {};

    ngOnInit(): void {
        this.user = this.serviceAuth.currentUser;
        this.form = { ...(this.data as ITypes['Computer']) };
    }

    submit() {
        this.onAddToCart.emit(this.form.id);
    }

    closemit() {
        this.close.emit();
    }

}