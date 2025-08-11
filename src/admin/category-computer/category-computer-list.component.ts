import { Component, inject, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { CategoryComputerService } from '../../services/api-service';
import { ITypes } from '../../constants/data';
import { CategoryComputerPopupComponent } from './category-computer-popup';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'category-computer-list',
    templateUrl: './category-computer-list.component.html',
    styleUrls: ['../../styles.css', './category-computer-list.component.css'],
    standalone: true,
    imports: [CategoryComputerPopupComponent, CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})

export class CategoryComputerListComponent implements OnInit {
    private svc = inject(CategoryComputerService);

    showForm = signal(false);
    selected = signal<ITypes['CategoryComputer'] | null>(null);

    // page
    pageNumber: number = 1;
    pageSize: number = 5;
    textSearch: string = '';

    IsDisablePrevious = true;
    ListDataDefault = [];
    IsDisableNext = true;

    dataPageSize = [
        { Key: 5, Value: '5 / page' },
        { Key: 10, Value: '10 / page' },
        { Key: 20, Value: '20 / page' },
        { Key: 50, Value: '50 / page' },
    ];

    list = signal<ITypes['CategoryComputer'][]>([]);

    ngOnInit(): void {
        this.getByFilter();
    }

    getByFilter() {
        const filter = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            textSearch: this.textSearch
        };
        this.svc.getByFilter(filter).subscribe((res) => {
            console.log('getByFilter', res);
            this.IsDisableNext = true;
            this.IsDisablePrevious = true;
            // pagging
            if (res.data.length > 0) {
                if (this.pageNumber > 1)
                    this.IsDisablePrevious = false;

                //Load data to grid
                this.ListDataDefault = res.data;
                //Enable next button
                if (res.data.length > this.pageSize) {
                    this.IsDisableNext = false;
                    this.ListDataDefault.splice(this.pageSize, 1);
                }
            }
            this.list.set(this.ListDataDefault|| []);

            console.log('list', this.list());
        }, (err) => {
        });
    }

    goPrev(): void {
        if (this.pageNumber > 1) {
        this.pageNumber--;
        this.getByFilter();
        }
    }

    goNext(): void {
        this.pageNumber++;
        this.getByFilter();
    }

    search(): void {
        this.pageNumber = 1;
        this.getByFilter();
    }

    openAdd() {
        this.selected.set(null);
        this.showForm.set(true);
    }

    openEdit(item: ITypes['CategoryComputer']) {
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
            this.svc.delete(id).subscribe(() => {
                this.getByFilter();
            });
        }
    }

    save(mt: ITypes['CategoryComputer']) {
        if (mt.id) {
            this.svc.update(mt.id, mt).subscribe({
                next: (res) => {
                    console.log('Update successful:', res);
                    this.getByFilter();
                },
                error: (err) => {
                    console.error('Validation errors:', err.error.errors);
                }
            });
        }  
        else
            this.svc.create(mt).subscribe({
                next: (res) => {
                    console.log('Create successful:', res);
                    this.getByFilter();
                },
                error: (err) => {
                    console.error('Validation errors:', err.error.errors);
                }
            });;
        this.closeForm();
    }
}