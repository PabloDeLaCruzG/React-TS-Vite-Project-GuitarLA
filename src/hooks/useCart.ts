import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import type { GuitarT, CartItemT } from '../types/types';

export const useCart = () => {
    
    // Funcion para el localstorage, si el localstorage es nulo devuelve un array vacio, y si no parsea a array y lo devuelve
    const initialCart = () : CartItemT[] => {
        const localStorageCart = localStorage.getItem('cart');
        if(localStorageCart) {
        return JSON.parse(localStorageCart);
        } else {
        return [];
        }
    }

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);

    // Cuando se modifique el cart se ejecuta lo de dentro.
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item : GuitarT) => {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id);
        if(itemExists >= 0) { // if item exists returns the position of the item, else return -1
            if(cart[itemExists].quantity >= 5) return;
            const updatedCart = [...cart];
            updatedCart[itemExists].quantity++;
            setCart(updatedCart);
        } else {
            const newItem : CartItemT = {...item, quantity: 1}
            setCart([...cart, newItem]);
        }
    }

    const removeFromCart = (id : GuitarT['id']) => {
        // Set in to the cart, the guitar id is diferent from the guitar clicked (id)
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    const increaseQuantity = (id : GuitarT['id']) => {
        const updatedCart = cart.map((item) => {
        if(item.id === id && item.quantity < 5) {
            return {
            ...item,
            quantity: item.quantity + 1,
            }
        }
        return item;
        })
        setCart(updatedCart);
    }

    const decreaseQuantity = (id : GuitarT['id']) => {
        const updatedCart = cart.map((item) => {
        if(item.id === id && item.quantity > 1) {
            return {
            ...item,
            quantity: item.quantity - 1,
            }
        }
        return item;
        })
        setCart(updatedCart);
    }

    const clearCart = () => {
        setCart([]);
    }

    // State derivado
    // useMemo sirve para que solo cargue en render cuando cart se modifique (mejora la performance del codigo)
    const isEmpty = useMemo ( () => cart.length === 0, [cart]);
    const cartTotal = useMemo ( () => cart.reduce( (total, item) => total + (item.quantity * item.price), 0), [cart] );

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}