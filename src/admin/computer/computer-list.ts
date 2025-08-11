import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CategoryComputerService, ComputerService } from "../../services/api-service";
import { ITypes } from "../../constants/data";
import { ComputerPopupComponent } from "./computer-popup";
import { env } from "../../env/env";


@Component({
    selector: 'computer-list',
    templateUrl: './computer-list.html',
    styleUrls: ['../../styles.css', './computer-list.css'],
    standalone: true,
    imports: [ComputerPopupComponent, CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})

export class ComputerListComponenr implements OnInit {
    private service = inject(ComputerService);
    private serviceCategory = inject(CategoryComputerService);

    api = env.baseUrl;

    showForm = signal(false);
    selected = signal<ITypes['Computer'] | null>(null);

    // page
    pageNumber: number = 1;
    pageSize: number = 5;
    textSearch: string = '';
    categoryId: string | null = null;

    IsDisablePrevious = true;
    IsDisableNext = true;

    dataPageSize = [
        { Key: 5, Value: '5 / page' },
        { Key: 10, Value: '10 / page' },
        { Key: 20, Value: '20 / page' },
        { Key: 50, Value: '50 / page' },
    ];

    ListDataDefault = signal<ITypes['Computer'][]>([]);
    ListCategory = signal<ITypes['CategoryComputer'][]>([]);

    ngOnInit(): void {
        this.loadData();
        this.getCategoryComputer();
    }

    loadData(): void {
        const filter = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            textSearch: this.textSearch,
            categoryId: this.categoryId
        };
        this.service.getByFilter(filter).subscribe((res) => {
            console.log('getByFilter', res);
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
                if (res.data.length > this.pageSize) {
                    this.IsDisableNext = false;
                    data.splice(this.pageSize, 1);
                }
            }
            this.ListDataDefault.set(data || []);

            console.log('list', this.ListDataDefault());
        }, (err) => {
        });
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

    getCategoryComputer(): void{
        this.serviceCategory.getByFilter().subscribe({
            next: (res) => {
                this.ListCategory.set(res.data);
                console.log('category: ', this.ListCategory);
            },
            error: (err) => {
                console.log(err);
            }
        })
    }
    
    openAdd() {
        this.selected.set(null);
        this.showForm.set(true);
    }

    openEdit(item: ITypes['Computer']) {
        this.selected.set({ ...item });
        this.showForm.set(true);
    }

    closeForm() {
        this.showForm.set(false);
    }

    deleteItem(id: string | null) {
        if (!id) {
            alert('Không có id để xóa');
            return;
        }
        if (confirm('Bạn có chắc muốn xóa?')) {
            this.service.delete(id).subscribe(() => {
                this.loadData();
            });
        }
    }

    save(mt: any) {
        const formData = new FormData();

        // Append các trường trong model (bỏ qua field null/undefined)
        for (const key in mt) {
            if (key !== 'coverImage' && mt[key] !== undefined && mt[key] !== null) {
                formData.append(key, mt[key]);
            }
        }

        // Append file nếu có
        if (mt.coverImage) {
            formData.append('coverImage', mt.coverImage);
        }

        // Gửi request
        if (mt.id) {
            this.service.update(mt.id, formData).subscribe({
                next: () => this.loadData(),
                error: (err) => console.error(err)
            });
        } else {
            this.service.create(formData).subscribe({
                next: () => this.loadData(),
                error: (err) => console.error(err)
            });
        }

        this.closeForm();
    }


}