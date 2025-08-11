import { Component, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { AuthService } from "../../services/api-service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['../view-home-style.css'],
    standalone: true,
    imports: [CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

    user = signal<any>(null);
    charImg = signal<string | null>(null);

    constructor(private auth: AuthService) { }
    
    ngOnInit(): void {
        this.loadUser();
    }

    loadUser() {
        var data = this.auth.currentUser;
        this.user.set(data);
        const firstWord = data.firstName.charAt(0);
        const lastWord = data.lastName.charAt(0);
        this.charImg.set(`${firstWord}${lastWord}`);
    }
}