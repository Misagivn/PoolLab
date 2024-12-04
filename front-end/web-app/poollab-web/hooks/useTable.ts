import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { 
  BilliardTable, 
  Area, 
  BilliardPrice, 
  BilliardType,
  TableFilters,
  TableDetail, 
  UpdateTableData
} from '@/utils/types/table.types';
import { billiardTableApi } from '@/apis/table.api';
import { areaApi } from '@/apis/area.api';
import { billiardPriceApi } from '@/apis/billiard-price.api';
import { billiardTypeApi } from '@/apis/billiard-type.api';

export const useBilliardManager = () => {
  const [tables, setTables] = useState<BilliardTable[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [prices, setPrices] = useState<BilliardPrice[]>([]);
  const [types, setTypes] = useState<BilliardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filters, setFilters] = useState<TableFilters>({
    searchQuery: '',
    statusFilter: 'all',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0
  });
  const toast = useToast();

  const fetchAreas = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as { storeId: string };
      const response = await areaApi.getAllAreas();

      if (response.status === 200) {
        const storeAreas = (response.data as Area[]).filter(
          area => area.storeId === decoded.storeId
        );
        setAreas(storeAreas);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách khu vực',
        status: 'error',
        duration: 3000,
      });
      setAreas([]);
    }
  }, [toast]);

  const fetchPrices = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await billiardPriceApi.getAllPrices(token);
      if (response.status === 200) {
        setPrices(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách giá',
        status: 'error',
        duration: 3000,
      });
      setPrices([]);
    }
  }, [toast]);

  const fetchTypes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await billiardTypeApi.getAllTypes(token);
      if (response.status === 200) {
        setTypes(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách loại bàn',
        status: 'error',
        duration: 3000,
      });
      setTypes([]);
    }
  }, [toast]);

  const fetchTables = useCallback(async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const decoded = jwtDecode(token) as { storeId: string };
      const storeId = decoded.storeId;
  
      const response = await billiardTableApi.getAllTables({
        pageNumber,
        pageSize: pagination.pageSize,
        token
      });

      if (response.status === 200) {
        const filteredTables = response.data.items.filter(
          (table: BilliardTable) => table.storeId === storeId
        );
        setTables(filteredTables);
        setPagination({
          currentPage: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách bàn',
        status: 'error',
        duration: 3000,
      });
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, toast]);

  const handlePageChange = (page: number) => {
    fetchTables(page);
  };

  const fetchTableDetail = useCallback(async (tableId: string) => {
    try {
      setDetailLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await billiardTableApi.getTableById(tableId, token);
      if (response.status === 200) {
        setSelectedTable(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin chi tiết bàn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setSelectedTable(null);
    } finally {
      setDetailLoading(false);
    }
  }, [toast]);

  const createTable = async (tableData: any, imageFile: File) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const imageResponse = await billiardTableApi.uploadImage(imageFile, token);
      if (imageResponse.status !== 200) throw new Error('Failed to upload image');

      const decoded = jwtDecode(token) as any;
      const finalData = {
        ...tableData,
        storeId: decoded.storeId,
        image: imageResponse.data,
      };

      const response = await billiardTableApi.createTable(finalData, token);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Đã thêm bàn mới',
          status: 'success',
          duration: 3000,
        });
        fetchTables();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo bàn mới',
        status: 'error',
        duration: 3000,
      });
      throw error;
    }
  };

  const deleteTable = async (tableId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await billiardTableApi.deleteTable(tableId, token);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Đã xóa bàn',
          status: 'success',
          duration: 3000,
        });
        fetchTables();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bàn',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const updateTable = async (tableId: string, tableData: UpdateTableData, imageFile?: File) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      let imageUrl = tableData.image;
      if (imageFile) {
        const imageResponse = await billiardTableApi.uploadImage(imageFile, token);
        if (imageResponse.status === 200) {
          imageUrl = imageResponse.data;
        }
      }

      const finalData = {
        ...tableData,
        image: imageUrl,
      };

      const response = await billiardTableApi.updateTable(tableId, finalData, token);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật thông tin bàn',
          status: 'success',
          duration: 3000,
        });
        fetchTables();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin bàn',
        status: 'error',
        duration: 3000,
      });
      throw error;
    }
  };

  const updateTableStatus = async (tableId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await billiardTableApi.updateTableStatus(tableId, status, token);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật trạng thái bàn',
          status: 'success',
          duration: 3000,
        });
        fetchTables();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái bàn',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchTables(),
          fetchAreas(),
          fetchPrices(),
          fetchTypes()
        ]);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [fetchTables, fetchAreas, fetchPrices, fetchTypes]);

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
    if (filters.statusFilter === 'all') return matchesSearch;
    return matchesSearch && table.status.toLowerCase() === filters.statusFilter.toLowerCase();
  });

  return {
    tables: filteredTables,
    areas,
    prices,
    types,
    loading,
    filters,
    updateTable,
    updateTableStatus,
    setFilters,
    createTable,
    deleteTable,
    selectedTable,
    detailLoading,
    fetchTableDetail,
    refreshTables: fetchTables,
    pagination,
    handlePageChange
  };
};