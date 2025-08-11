import { Component, inject, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { AuthService, CartService, ComputerService } from "../../services/api-service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { data, ITypes } from "../../constants/data";
import { env } from "../../env/env";
import { Router } from "@angular/router";
import { HomePopupComponent } from "./home-popup";

@Component({
    selector: 'home-view',
    templateUrl: './home.html',
    styleUrls: ['../view-home-style.css'],
    imports: [HomePopupComponent, CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

    private service = inject(ComputerService);
    private serviceAuth = inject(AuthService);
    private serviceCart = inject(CartService);
    private router = inject(Router);

    apiBase = env.baseUrl;

    ListProduct: ITypes['Computer'][] = [];
    // page
    pageNumber: number = 1;
    pageSize: number = 8;
    textSearch: string = '';

    IsDisablePrevious = true;
    IsDisableNext = true;

    dataPageSize = [
        { Key: 4, Value: '4 / page' },
        { Key: 8, Value: '8 / page' },
        { Key: 20, Value: '20 / page' },
    ];

    user: any = {};

    showForm = signal(false);
    selected = signal<ITypes['Computer'] | null>(null);

    ngOnInit(): void {
        this.user = this.serviceAuth.currentUser;
        this.loadData();
    }

    loadData(): void {
        const filter = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            textSearch: this.textSearch,
            viewHome: true
        };
        this.service.getByFilter(filter).subscribe({
            next: res => {
                if (res.status == 1) {
                    this.IsDisableNext = true;
                    this.IsDisablePrevious = true;
                    let data = [];
                    // pagging
                    if (res.data.length > 0) {
                        if (this.pageNumber > 1)
                            this.IsDisablePrevious = false;

                        //Load data to grid
                        data = res.data;
                        //Enable next button
                        if (data.length > this.pageSize) {
                            this.IsDisableNext = false;
                            data.splice(this.pageSize, 1);
                        }
                    }
                    this.ListProduct = data;
                } else {
                    console.log(res);
                }
            },
            error: err => {
                console.log(err);
            }
        })
    };

    goPrev(): void {
        this.pageNumber--;
        this.loadData();
    };

    goNext(): void {
        this.pageNumber++;
        this.loadData();
    };

    search(): void {
        this.pageNumber = 1;
        this.loadData();
    };

    openInfo(item: ITypes['Computer']) {
        this.selected.set({ ...item });
        this.showForm.set(true);
    }

    addToCart(productId: string | null) {
        if (!this.user || !this.user.id) {
            console.log('user bị null');
            this.router.navigate(['/login']);
            return;
        }
        if (productId == null) {
            console.log('lỗi không tìm thây sản phẩm');
            return;
        }
        // localStorage.setItem("cart", JSON.stringify(this.cartItems));
        let model = { ...data.Cart };
        model.userId = this.user.id;
        model.productId = productId
        this.serviceCart.addToCart(model).subscribe({
            next: res => {
                if (res.status == 1) {
                    this.closeForm();
                    this.router.navigate(['/cart'])
                }
                else {
                    console.log(res);
                }
            },
            error: err => {
                console.log(err);
            }
        })
    }

    closeForm() {
        this.showForm.set(false);
    }


}