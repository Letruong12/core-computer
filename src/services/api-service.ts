import { Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, switchMap, throwError } from "rxjs";
import { env } from "../env/env";
import { ITypes } from "../constants/data";

const baseUrl = env.baseUrl;

@Injectable({ providedIn: 'root' })
export class ComputerService  {
    private apiUrl = `${baseUrl}/api/coremaytinh`;

    constructor(private http: HttpClient) {}

    getByFilter(filter: any): Observable<any> {
        const params = new HttpParams().set('filter', JSON.stringify(filter));
        return this.http.get<any>(this.apiUrl, { params });
    }

    getById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    create(data: FormData): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    update(id: string, data: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}

@Injectable({ providedIn: 'root' })
export class CategoryComputerService  {
    private apiUrl = `${env.baseUrl}/api/coreloaimaytinh`;

    constructor(private http: HttpClient) {}

    getByFilter(filter: any = {}): Observable<any> {
        const params = new HttpParams().set('filter', JSON.stringify(filter));
        return this.http.get<any>(this.apiUrl, { params });
    }

    getById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    create(data: ITypes['CategoryComputer']): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    update(id: string, data: ITypes['CategoryComputer']): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authApiUrl = `${env.baseUrl}/api/auth`;

    private currentUserSubject = new BehaviorSubject<any>(null);

    private isLoggedIn = signal(false);
    private username = signal('');
    private role = signal('');

    constructor(private http: HttpClient) {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) this.currentUserSubject.next(JSON.parse(savedUser));
    }

    private parseJwt(token: string): any {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    }


    login(dto: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.authApiUrl}/login`, dto).pipe(
            map((res: any) => {
                sessionStorage.setItem('accessToken', res.accessToken);
                sessionStorage.setItem('refreshToken', res.refreshToken);

                // ✅ Decode token để lấy role
                const decodedToken = this.parseJwt(res.accessToken);

                const currentUser = {
                    id: res.user.id,
                    firstName: res.user.firstName,
                    lastName: res.user.lastName,
                    email: res.user.email,
                    role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
                };

                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                this.currentUserSubject.next(currentUser);

                return currentUser;
            }),
            catchError(err => throwError(() => err))
        );
    }

    register(dto: any): Observable<any> {
        return this.http.post(`${this.authApiUrl}/register`, dto)
        .pipe(catchError(err => throwError(() => err)));
    }

    refreshToken(): Observable<any> {
        const refreshToken = sessionStorage.getItem('refreshToken');
        return this.http.post(`${this.authApiUrl}/refresh`, { refreshToken })
        .pipe(
            switchMap((res: any) => {
            sessionStorage.setItem('accessToken', res.accessToken);
            return this.currentUserSubject;
            }),
            catchError(err => throwError(() => err))
        );
    }

    logout() {
        sessionStorage.clear();
        this.currentUserSubject.next(null);
    }

    setLoginState(status: boolean, name: string = '', role: string = '') {
        this.isLoggedIn.set(status);
        this.username.set(name);
        this.role.set(role);
    }

    get currentUser() {
        return this.currentUserSubject.value;
    }

    get token() {
        return sessionStorage.getItem('accessToken');
    }

    get IsLoggedIn() {
        if (this.isLoggedIn() == false || this.isLoggedIn() == null) {
            var check = sessionStorage.getItem('currentUser');
            if (check != null)
                this.isLoggedIn.set(true);
        }
        return this.isLoggedIn;
    }

    get UserName() {
        if (this.username() == '' || this.username() == null) {
            var check = sessionStorage.getItem('currentUser');
            if (check != null) {
                var user = JSON.parse(check);
                this.username.set(`${user.firstName} ${user.lastName}`);
            }
        }
        return this.username;
    }

    get Role() {
        if (this.role() == '' || this.role() == null) {
            var check = sessionStorage.getItem('currentUser');
            if (check != null) {
                var user = JSON.parse(check);
                this.role.set(user.role);
            }
        }
        return this.role;
    }

}

@Injectable({ providedIn: 'root' })
export class CartService {
    private apiUrl = `${env.baseUrl}/api/corecart`;

    constructor(private http: HttpClient) {}

    // Lấy giỏ hàng theo filter
    getByFilter(filter: any = {}): Observable<any> {
        const params = new HttpParams().set('filter', JSON.stringify(filter));
        return this.http.get<any>(this.apiUrl, { params });
    }

    // Thêm sản phẩm vào giỏ hàng
    addToCart(data: ITypes['Cart']): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/addtocart`, data);
    }

    // Cập nhật tăng/giảm số lượng trong giỏ
    updateCart(data: ITypes['Cart']): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/updatecart`, data);
    }

    // Xóa sản phẩm khỏi giỏ (dựa theo userId và productId)
    deleteCart(userId: string, productId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/addtocart`, { params: { userId, productId }});
    }
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private userApiUrl = `${env.baseUrl}/api/users`;
    constructor(private http: HttpClient) { }
    
    getAllUser(): Observable<any> {
        return this.http.get<any>(this.userApiUrl);
    }

    getUser(id: string): Observable<any> {
        return this.http.get<any>(`${this.userApiUrl}/${id}`);
    }
}