import { Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { data, ITypes } from "../../constants/data";
import { CategoryComputerService } from "../../services/api-service";
import { CommonModule } from "@angular/common";
import { env } from "../../env/env";

@Component({
    selector: 'computer-popup',
    templateUrl: './computer-popup.html',
    styleUrls: ['./computer-list.css'],
    imports: [CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})
export class ComputerPopupComponent implements OnInit {
    @Input() data: ITypes['Computer'] | null = null;
    @Output() save = new EventEmitter<ITypes['Computer']>();
    @Output() close = new EventEmitter<void>();

    // service
    private serviceCategory = inject(CategoryComputerService);

    form: ITypes['Computer'] = { ...data.Computer };
    ListCategory: ITypes['CategoryComputer'][] = [];

    private baseUrl = env.baseUrl;

    ngOnInit(): void {
        this.getCategoryComputer();
        console.log(this.form);
        if (this.form) {
            this.previewUrl = this.baseUrl + this.form.imageUrl;
        }
    }

    ngOnChanges() {
        if (this.data) {
            this.form = { ...this.data };
        } else {
            this.form = { ...data.Computer };
        }
    }

    selectedFile: File | null = null;
    previewUrl: string | null = null;

    // onFileSelected(event: any) {
    //     const file = event.target.files[0];
    //     if (file) {
    //         this.selectedFile = file;
    //     }
    // }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];

            // ✅ Preview ảnh
            const reader = new FileReader();
            reader.onload = (e: any) => this.previewUrl = e.target.result;
            reader.readAsDataURL(this.selectedFile);
        }
    }

    submit() {
        const payload = { ...this.form }; 
        // emit cả dữ liệu và file
        this.save.emit({ ...payload, coverImage: this.selectedFile } as any);
    }

    closemit() {
        this.close.emit();
    }

    getCategoryComputer(): void{
        this.serviceCategory.getByFilter().subscribe({
            next: (res) => {
                this.ListCategory = res.data;
                console.log('category: ', this.ListCategory);
            },
            error: (err) => {
                console.log(err);
            }
        })
    }
}