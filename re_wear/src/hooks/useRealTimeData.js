import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useRealTimeData = (initialData = [], dataType = 'items') => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket, isConnected } = useSocket();

  // Update data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Handle real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleItemAdded = (newItem) => {
      setData(prev => [newItem, ...prev]);
    };

    const handleItemUpdated = (updatedItem) => {
      setData(prev => prev.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      ));
    };

    const handleItemDeleted = (itemId) => {
      setData(prev => prev.filter(item => item._id !== itemId));
    };

    const handleSwapRequest = (swapData) => {
      // Update item with new swap request
      setData(prev => prev.map(item => {
        if (item._id === swapData.itemId) {
          return {
            ...item,
            swapRequests: [...(item.swapRequests || []), {
              user: swapData.fromUserId,
              status: 'Pending',
              message: swapData.message,
              createdAt: new Date()
            }]
          };
        }
        return item;
      }));
    };

    const handleSwapStatusUpdate = (swapData) => {
      // Update swap request status
      setData(prev => prev.map(item => {
        if (item._id === swapData.itemId) {
          return {
            ...item,
            swapRequests: item.swapRequests?.map(request => {
              if (request.user === swapData.fromUserId) {
                return { ...request, status: swapData.status };
              }
              return request;
            }) || []
          };
        }
        return item;
      }));
    };

    // Set up event listeners based on data type
    if (dataType === 'items') {
      socket.on('item-added', handleItemAdded);
      socket.on('item-updated', handleItemUpdated);
      socket.on('item-deleted', handleItemDeleted);
      socket.on('swap-request', handleSwapRequest);
      socket.on('swap-status-updated', handleSwapStatusUpdate);
    }

    return () => {
      if (dataType === 'items') {
        socket.off('item-added', handleItemAdded);
        socket.off('item-updated', handleItemUpdated);
        socket.off('item-deleted', handleItemDeleted);
        socket.off('swap-request', handleSwapRequest);
        socket.off('swap-status-updated', handleSwapStatusUpdate);
      }
    };
  }, [socket, isConnected, dataType]);

  // Function to manually update data
  const updateData = useCallback((newData) => {
    setData(newData);
  }, []);

  // Function to add item
  const addItem = useCallback((item) => {
    setData(prev => [item, ...prev]);
  }, []);

  // Function to update item
  const updateItem = useCallback((itemId, updates) => {
    setData(prev => prev.map(item => 
      item._id === itemId ? { ...item, ...updates } : item
    ));
  }, []);

  // Function to remove item
  const removeItem = useCallback((itemId) => {
    setData(prev => prev.filter(item => item._id !== itemId));
  }, []);

  // Function to refresh data
  const refreshData = useCallback(async (fetchFunction) => {
    if (!fetchFunction) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    updateData,
    addItem,
    updateItem,
    removeItem,
    refreshData
  };
}; 