export type GuitarT = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
}

export type CartItemT = GuitarT & { quantity: number };