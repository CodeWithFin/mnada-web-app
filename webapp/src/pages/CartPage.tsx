import React, { useEffect, useState } from 'react';
import { cartService, type CartItem } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await cartService.list(user.id);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user?.id]);

  const remove = async (productId: string) => {
    if (!user) return;
    await cartService.remove(user.id, productId);
    await load();
  };

  const clear = async () => {
    if (!user) return;
    await cartService.clear(user.id);
    await load();
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
  <p className="text-gray-700 dark:text-gray-300">Please <Link to="/auth/login" className="text-purple-600 hover:text-purple-700">sign in</Link> to view your cart.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Cart</h1>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                {it.product?.image_url && (
                  <img src={it.product.image_url} alt={it.product?.name} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{it.product?.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Qty: {it.quantity}</div>
                </div>
              </div>
              <button onClick={() => remove(it.product_id)} className="text-sm text-red-600 hover:underline">Remove</button>
            </div>
          ))}
          <div className="flex justify-end">
            <button onClick={clear} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Clear Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
