import React, { useState, useEffect } from 'react';
import './ProductsPage.css';
import ProductList from '../../components/ProductList';
import ProductModal from '../../components/ProductModal';
import { api } from '../../api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки товаров. Убедитесь, что сервер запущен.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setModalMode('create');
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот товар?')) return;
    
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении товара');
    }
  };

  const handleSubmit = async (productData) => {
    try {
      if (modalMode === 'create') {
        const newProduct = await api.createProduct(productData);
        setProducts(prev => [...prev, newProduct]);
      } else {
        const updatedProduct = await api.updateProduct(productData.id, productData);
        setProducts(prev => prev.map(p => p.id === productData.id ? updatedProduct : p));
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении товара');
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="headerInner">
          <div className="brand">🛒 Интернет-магазин</div>
          <div>React + Express</div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1>Товары ({products.length})</h1>
            <button className="btn btn--primary" onClick={openCreate}>
              + Добавить товар
            </button>
          </div>

          {loading ? (
            <div className="loading">Загрузка товаров...</div>
          ) : (
            <ProductList 
              products={products} 
              onEdit={openEdit} 
              onDelete={handleDelete} 
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footerInner">
          © {new Date().getFullYear()} Интернет-магазин
        </div>
      </footer>

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}