'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeCart } from '../../../redux/slices/cartSlice';

export default function CartInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeCart());
  }, [dispatch]);

  return null;
}