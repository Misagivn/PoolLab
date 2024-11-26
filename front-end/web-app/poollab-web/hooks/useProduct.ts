// hooks/useProduct.ts
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { Product, PaginatedResponse, ProductFilters } from '@/utils/types/product.types';
import { productApi } from '@/apis/product.api';

interface JWTPayload {
  storeId: string;
  [key: string]: any;
}

export const useProduct = () => {
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Filters State
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    groupName: 'all',
    status: 'all',
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    fetchProducts(1, pageSize, {
      ...filters,
      search: debouncedSearch
    });
  }, [debouncedSearch, filters.groupName, filters.status]);

  const getStoreId = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const decoded = jwtDecode(token) as JWTPayload;
    if (!decoded.storeId) throw new Error('No store ID found in token');

    return decoded.storeId;
  }, []);

  const fetchProducts = useCallback(async (
    page: number = 1,
    size: number = pageSize,
    currentFilters = filters
  ) => {
    try {
      setLoading(true);
      const storeId = getStoreId();

      const response = await productApi.getAllProducts(page, size, currentFilters);

      if (response.status === 200) {
        const filteredProducts = response.data.items.filter(
          (product: Product) => product.storeId === storeId
        );
        setProducts(filteredProducts);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.pageNumber);
        setTotalItems(response.data.totalItem);
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch products');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setProducts([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, pageSize, getStoreId, filters]);

  const createProduct = useCallback(async (data: Omit<Product, 'id'>) => {
    try {
      const storeId = getStoreId();
      const response = await productApi.createProduct({
        ...data,
        storeId
      });

      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm sản phẩm mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchProducts(currentPage, pageSize);
        return response.data;
      }
      throw new Error(response.message);
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm sản phẩm mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  }, [toast, fetchProducts, currentPage, pageSize, getStoreId]);

  const updateProduct = useCallback(async (
    id: string,
    data: Partial<Product>
  ) => {
    try {
      const storeId = getStoreId();
      const response = await productApi.updateProduct(id, {
        ...data,
        storeId
      });

      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật sản phẩm thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchProducts(currentPage, pageSize);
        return response.data;
      }
      throw new Error(response.message);
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  }, [toast, fetchProducts, currentPage, pageSize, getStoreId]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await productApi.deleteProduct(id);

      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa sản phẩm thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        const newPage = products.length === 1 && currentPage > 1 
          ? currentPage - 1 
          : currentPage;
        await fetchProducts(newPage, pageSize);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  }, [toast, fetchProducts, currentPage, pageSize, products.length]);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  }, []);

  const handleRefresh = useCallback(() => {
    setFilters({
      search: '',
      groupName: 'all',
      status: 'all',
    });
    setCurrentPage(1);
    fetchProducts(1, pageSize, {
      search: '',
      groupName: 'all',
      status: 'all',
    });
  }, [pageSize, fetchProducts]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchProducts(page, pageSize);
  }, [pageSize, fetchProducts]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); 
    fetchProducts(1, newSize);
  }, [fetchProducts]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }, []);

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return {
    products,
    loading,
    totalPages,
    currentPage,
    pageSize,
    totalItems,
    filters,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    handleFiltersChange,
    handleRefresh,
    handlePageChange,
    handlePageSizeChange,
    formatPrice,
    formatDate
  };
};