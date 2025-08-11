import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { env } from "../../env/env";
import { AuthService, CartService } from "../../services/api-service";
import { Router } from "@angular/router";
import { data } from "../../constants/data";

@Component({
    selector: 'cart-view',
    templateUrl: './cart.html',
    styleUrls: ['../view-home-style.css'],
    imports: [CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit {
    private serviceCart = inject(CartService);
    private serviceAuth = inject(AuthService);
    private router = inject(Router);
    apiBase = env.baseUrl;
    cartItems: any[] = []; 

    // page
    pageNumber: number = 1;
    pageSize: number = 10;
    textSearch: string = '';

    IsDisablePrevious = true;
    IsDisableNext = true;

    dataPageSize = [
        { Key: 5, Value: '5 / page' },
        { Key: 10, Value: '10 / page' },
        { Key: 20, Value: '20 / page' },
        { Key: 50, Value: '50 / page' },
    ];

    user: any = {};

    ngOnInit(): void {
        this.user = this.serviceAuth.currentUser;
        if (this.user == null) {
            this.router.navigate(['/login']);
        } else {
            this.loadData();
        }
    }

    loadData() {
        if (!this.user || !this.user.id) {
            console.log('user bị null');
        }

        const filter = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            textSearch: this.textSearch,
            userId: this.user.id
        };
        this.serviceCart.getByFilter(filter).subscribe({
            next: res => {
                console.log(res);
                this.IsDisableNext = true;
                this.IsDisablePrevious = true;
                let data = [];
                if (res.data.length > 0) {
                    if (this.pageNumber > 1)
                        this.IsDisablePrevious = false;
                    data = res.data;
                    if (res.data.length > this.pageSize) {
                        this.IsDisableNext = false;
                        data.splice(this.pageSize, 1);
                    }
                }
                this.cartItems = data;
            },
            error: err => {
                console.log(err);
            }
        })
    }

    goPrev(): void {
        this.pageNumber--;
        this.loadData();
    }

    goNext(): void {
        this.pageNumber++;
        this.loadData();
    }

    search(): void {
        this.pageNumber = 1;
        this.loadData();
    }

    saveCart(productId: string) {
        if (!this.user || !this.user.id) {
            console.log('user bị null');
            this.router.navigate(['/login']);
            return;
        }
        // localStorage.setItem("cart", JSON.stringify(this.cartItems));
        let model = { ...data.Cart };
        model.userId = this.user.id;
        model.productId = productId
        this.serviceCart.addToCart(model).subscribe({
            next: res => {
                if (res.status == 1) {
                    this.loadData();
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

    updateQuantity(item: any, status?: string | null) {
        if (!this.user || !this.user.id) {
            console.log('user bị null');
            this.router.navigate(['/login']);
            return;
        }
        let model = { ...data.Cart };
        model.productId = item.productId;
        model.userId = this.user.id;
        model.statusUpdateQuantity = status;
        model.quantity = item.quantity;
        this.serviceCart.updateCart(model).subscribe({
            next: res => {
                if (res.status == 1) {
                    this.loadData();
                } else {
                    console.log(res);
                }
            },
            error: err => {
                console.log(err);
            }
        })
    }

    removeItem(productId: string) {
        if (!this.user || !this.user.id) {
            console.log('user bị null');
            this.router.navigate(['/login']);
            return;
        }
        if (confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            this.serviceCart.deleteCart(this.user.id, productId).subscribe({
                next: res => {
                    if (res.status == 1) {
                        this.loadData();
                    } else {
                        console.log(res);
                    }
                },
                error: err => {
                    console.log(err);
                }
            })
        }
    }

    getTotal(): number {
        return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    checkout() {
        alert("Tiến hành thanh toán (tính năng đang phát triển)");
    }
}