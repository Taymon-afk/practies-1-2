import React, { useEffect, useState } from 'react';

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialProduct?.name || '');
    setCategory(initialProduct?.category || '');
    setDescription(initialProduct?.description || '');
    setPrice(initialProduct?.price?.toString() || '');
    setStock(initialProduct?.stock?.toString() || '');
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === 'edit' ? 'Редактировать товар' : 'Добавить товар';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !category.trim() || !description.trim() || !price || !stock) {
      alert('Заполните все поля');
      return;
    }
    
    const priceNum = Number(price);
    const stockNum = Number(stock);
    
    if (priceNum <= 0 || stockNum < 0) {
      alert('Цена должна быть больше 0, количество не может быть отрицательным');
      return;
    }
    
    onSubmit({
      id: initialProduct?.id,
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: priceNum,
      stock: stockNum
    });
  };

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalTitle">{title}</div>
          <button className="modalClose" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Название товара</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Например: Ноутбук Asus"
              autoFocus
            />
          </div>
          <div className="formGroup">
            <label>Категория</label>
            <input 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              placeholder="Например: Ноутбуки"
            />
          </div>
          <div className="formGroup">
            <label>Описание</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Описание товара"
            />
          </div>
          <div className="formGroup">
            <label>Цена (₽)</label>
            <input 
              type="number" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              placeholder="50000"
            />
          </div>
          <div className="formGroup">
            <label>Количество на складе</label>
            <input 
              type="number" 
              value={stock} 
              onChange={e => setStock(e.target.value)} 
              placeholder="10"
            />
          </div>
          <div className="modalFooter">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">
              {mode === 'edit' ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}