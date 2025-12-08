import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import UserTable from '../../components/admin/UserTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';

const UserManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [includeBlocked, setIncludeBlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [includeBlocked]);

  const fetchCustomers = async () => {
    try {
      const response = await adminService.getAllCustomers(includeBlocked);
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockClick = (customerId) => {
    setSelectedCustomerId(customerId);
    setModalAction('block');
    setModalOpen(true);
  };

  const handleUnblockClick = (customerId) => {
    setSelectedCustomerId(customerId);
    setModalAction('unblock');
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (modalAction === 'block') {
        await adminService.blacklistCustomer(selectedCustomerId, blockReason);
        alert('Customer blocked successfully');
      } else {
        await adminService.unblockCustomer(selectedCustomerId);
        alert('Customer unblocked successfully');
      }
      fetchCustomers();
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
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeBlocked}
                onChange={(e) => setIncludeBlocked(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Include Blocked Users</span>
            </label>
            <span className="text-gray-600">Total: {customers.length}</span>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No customers found</p>
          </div>
        ) : (
          <UserTable
            users={customers}
            onBlock={handleBlockClick}
            onUnblock={handleUnblockClick}
            userType="customer"
          />
        )}

        <ConfirmModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setBlockReason('');
          }}
          onConfirm={handleConfirmAction}
          title={modalAction === 'block' ? 'Block Customer' : 'Unblock Customer'}
          message={
            modalAction === 'block' ? (
              <div>
                <p className="mb-4">Are you sure you want to block this customer?</p>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Reason for blocking (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
            ) : (
              'Are you sure you want to unblock this customer?'
            )
          }
          confirmText={modalAction === 'block' ? 'Block' : 'Unblock'}
          danger={modalAction === 'block'}
        />
      </div>
    </div>
  );
};

export default UserManagement;
