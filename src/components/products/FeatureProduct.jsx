import React, { useState, useEffect, useCallback } from 'react';
import { ProductBanner, ProductCard } from '@/components';
import { apiGetProducts } from '@/apis';
import { RESPONSE_STATUS } from '@/utils/responseStatus';
import { PropagateLoader } from 'react-spinners';

const sortMap = {
  new: 'createdAt,desc',
  recommendation: 'sold,rating,desc',
};

const FeatureProduct = ({ flag = 'new' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { statusCode, data } = await apiGetProducts({
        page: 1,
        size: 12,
        sort: sortMap[flag],
      });
      if (statusCode === RESPONSE_STATUS.SUCCESS) {
        setProducts(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [flag]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl uppercase font-semibold border-b-4 border-main inline-block">
        {flag === 'new' ? 'Sản phẩm mới' : 'Có thể bạn sẽ thích'}
      </h2>

      <div className="min-h-[20vh] flex justify-center items-center">
        {loading ? (
          <PropagateLoader color="#36d7b7" size={15} />
        ) : products.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.map(p => (
              <ProductCard key={p.id} productData={p} />
            ))}
          </div>
        ) : (
          <p>Chưa có sản phẩm nào.</p>
        )}
      </div>

      {flag === 'new' && <ProductBanner />}
    </section>
  );
};

export default FeatureProduct;
