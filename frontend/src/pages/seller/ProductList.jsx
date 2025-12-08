import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductTable from '../../components/seller/ProductTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getSellerProducts();
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await productService.deleteProduct(selectedProductId);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-gray-600">Total: {products.length} products</p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-2xl font-semibold mb-2">No products yet</h2>
            <p className="text-gray-600">Start by adding your first product</p>
          </div>
        ) : (
          <ProductTable products={products} onDelete={handleDeleteClick} />
        )}

        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete"
          danger={true}
        />
      </div>
    </div>
  );
};

export default ProductList;