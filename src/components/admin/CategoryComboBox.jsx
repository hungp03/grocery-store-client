import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Select } from 'antd';

const { Option } = Select;

const CategoryComboBox = ({ onSelectCategory, search }) => {
    const { categories } = useSelector((state) => state.app);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleChange = (value) => {
        setSelectedCategory(value);
        const selectedCategory = categories.find(category => category.id === parseInt(value));
        if (onSelectCategory) {
            onSelectCategory(selectedCategory);
        }
    };

    const handleClear = () => {
        setSelectedCategory('');
        if (onSelectCategory) {
            onSelectCategory(null);
        }
    };

    return (
        <div className="w-full">
            <Select
                value={selectedCategory}
                onChange={handleChange}
                onClear={handleClear}
                className={`w-full rounded-md ${search ? 'text-sm' : ''}`}
                placeholder="Chọn phân loại"
                size={search ? 'small' : 'middle'}
                allowClear
            >
                <Option value="">Tất cả phân loại</Option>
                {categories?.map((category) => (
                    <Option key={category.id} value={category.id}>
                        {category.name}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default CategoryComboBox;
