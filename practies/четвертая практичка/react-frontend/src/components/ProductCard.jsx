import React from 'react';

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="productCard">
      <div className="productId">#{product.id}</div>
      <div className="productName">{product.name}</div>
      <div className="productCategory">{product.category}</div>
      <div className="productDesc">{product.description}</div>
      <div className="productPrice">{product.price} ₽</div>
      <div className="productStock">В наличии: {product.stock} шт.</div>
      <div className="productActions">
        <button className="btn" onClick={() => onEdit(product)}>✏️ Редактировать</button>
        <button className="btn btn--danger" onClick={() => onDelete(product.id)}>🗑️ Удалить</button>
      </div>
    </div>
  );
}