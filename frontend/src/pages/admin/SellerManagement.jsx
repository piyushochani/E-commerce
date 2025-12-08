import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import SellerTable from '../../components/admin/SellerTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [includeBlocked, setIncludeBlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    fetchSellers();
  }, [includeBlocked]);

  const fetchSellers = async () => {
    try {
      const response = await adminService.getAllSellers(includeBlocked);
      setSellers(response.data.sellers);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockClick = (sellerId) => {
    setSelectedSellerId(sellerId);
    setModalAction('block');
    setModalOpen(true);
  };

  const handleUnblockClick = (sellerId) => {
    setSelectedSellerId(sellerId);
    setModalAction('unblock');
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (modalAction === 'block') {
        await adminService.blacklistSeller(selectedSellerId, blockReason);
        alert('Seller blocked successfully');
      } else {
        await adminService.unblockSeller(selectedSellerId);
        alert('Seller unblocked successfully');
      }
      fetchSellers();
      setBlockReason('');
    } catch (error) {
      alert('Failed to perform action');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Seller Management</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeBlocked}
                onChange={(e) => setIncludeBlocked(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Include Blocked Sellers</span>
            </label>
            <span className="text-gray-600">Total: {sellers.length}</span>
          </div>
        </div>

        {sellers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No sellers found</p>
          </div>
        ) : (
          <SellerTable
            sellers={sellers}
            onBlock={handleBlockClick}
            onUnblock={handleUnblockClick}
          />
        )}

        <ConfirmModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setBlockReason('');
          }}
          onConfirm={handleConfirmAction}
          title={modalAction === 'block' ? 'Block Seller' : 'Unblock Seller'}
          message={
            modalAction === 'block' ? (
              <div>
                <p className="mb-4">Are you sure you want to block this seller?</p>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Reason for blocking (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
            ) : (
              'Are you sure you want to unblock this seller?'
            )
          }
          confirmText={modalAction === 'block' ? 'Block' : 'Unblock'}
          danger={modalAction === 'block'}
        />
      </div>
    </div>
  );
};

export default SellerManagement;
