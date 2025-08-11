// Khai báo các interface
export interface Computer {
    id: string | null;
    productName: string;
    description: string | null;
    price: number;
    quantity: number;
    imageUrl: string | null;
    isActive: boolean;
    categoryId: string | null;
    category: CategoryComputer | null;
    
    cpu: string | null;
    ram: string | null;
    storage: string | null;
    gpu: string | null;
    screen: string | null;
    os: string | null;
}

export interface CategoryComputer {
    id: string | null;
    categoryName: string;
    description: string | null;
    isActive: boolean;
}

export interface Cart {
    userId: string | null,
    productId: string | null,
    quantity: number | null,
    statusUpdateQuantity?: string | null,
    product?: Computer | null
}

// Interface gộp để truy cập kiểu như ITypes['Computer']
export interface ITypes {
    Computer: Computer;
    CategoryComputer: CategoryComputer;
    Cart: Cart
}

// data mẫu
export const data: ITypes = {
    Computer: {
        id: null,
        productName: '',
        description: null,
        price: 0,
        quantity: 0,
        imageUrl: null,
        isActive: true,
        categoryId: null,
        category: null,
        cpu: null,
        ram: null,
        storage: null,
        gpu: null,
        screen: null,
        os: null
    },
    CategoryComputer: {
        id: null,
        categoryName: '',
        description: null,
        isActive: true
    },
    Cart: {
        userId: null,
        productId: null,
        quantity: 0,
        statusUpdateQuantity: null,
        product: null
    }
};
