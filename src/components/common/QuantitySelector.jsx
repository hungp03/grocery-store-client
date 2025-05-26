import React from 'react';

const QuantitySelector = ({ quantity, stock, onIncrease, onDecrease, onChange }) => {
  const onInput = e => {
    const v = parseInt(e.target.value, 10);
    onChange(isNaN(v) ? 1 : v);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onDecrease}
        className="px-2 py-1 border bg-slate-100 rounded hover:bg-gray-200"
      >−</button>
      <input
        type="number"
        value={quantity}
        onChange={onInput}
        min="1"
        max={stock}
        className="w-12 text-center border rounded"
      />
      <button
        onClick={onIncrease}
        className="px-2 py-1 border bg-slate-100 rounded hover:bg-gray-200"
      >+</button>
    </div>
  );
};

export default QuantitySelector;