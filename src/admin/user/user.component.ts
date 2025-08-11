import { Component, inject, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { AuthService, UserService } from "../../services/api-service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserPopupComponent } from "./user-popup.component";

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['../../styles.css', './user.component.css'],
    standalone: true,
    imports: [UserPopupComponent, CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
    
    private service = inject(UserService);
    private serviceAuth = inject(AuthService);


    // page
    pageNumber: number = 1;
    pageSize: number = 5;
    textSearch: string = '';

    IsDisablePrevious = true;
    IsDisableNext = true;

    dataPageSize = [
        { Key: 5, Value: '5 / page' },
        { Key: 10, Value: '10 / page' },
        { Key: 20, Value: '20 / page' },
        { Key: 50, Value: '50 / page' },
    ];

    dataUser = signal<any>([])

    showForm = signal(false);
    selected = signal<any | null>(null);

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.service.getAllUser().subscribe({
            next: res => {
                console.log(res);   
                this.IsDisableNext = true;
                this.IsDisablePrevious = true;

                let dataDefault = res;
                this.dataUser.set([]);
                if (dataDefault.length > 0) {
                    let start = this.pageNumber == 1 ? 0 : (this.pageNumber - 1) * this.pageSize;
                    let end = start + this.pageSize + 1;
                    let temp = dataDefault.slice(start, end);

                    if (this.pageNumber > 1)
                        this.IsDisablePrevious = false;

                    this.IsDisableNext = temp.length <= this.pageSize;
                    var data = temp.slice(0, this.pageSize);
                    this.dataUser.set(data);
                }
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

    openAddForm() {
        const item = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            confirmPassword: null,
            role: 'Customer'
        }
        this.selected.set({ ...item });
        this.showForm.set(true);
    }
    
    closeForm() {
        this.showForm.set(false);
    }

    SaveForm(item: any) {
        console.log(item);
        this.serviceAuth.register(item).subscribe({
            next: res => {
                console.log(res.data);
                this.pageNumber = 1;
                this.loadData();
                this.closeForm();
            },
            error: err => {
                console.log(err);
            }
        })
    }
}