import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useCartMutation } from './useCartMutation';
import { CartItem } from "../Configurator/types";


export const useAddToCart = () => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addToCart: addToCartMutation } = useCartMutation();

  const addToCart = async (item: CartItem) => {

    if (!item.options.color || !item.options.seating) {
      setError('Please select both a color and a seating option');
      return;
    }

    setIsAddingToCart(true);
    setError(null);
    try {
      await addToCartMutation(item);
      router.push('/cart');
    } catch (err) {
      setError('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return {
    addToCart,
    isAddingToCart,
    error,
    setError
  };
};