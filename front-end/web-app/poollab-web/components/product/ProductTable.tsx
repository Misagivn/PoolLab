// import React from 'react';
// import {
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Image,
//   Text,
//   Badge,
//   Flex,
//   IconButton,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Icon,
//   Skeleton,
//   Box,
// } from '@chakra-ui/react';
// import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
// import { Product } from '@/utils/types/product';

// interface ProductTableProps {
//   products: Product[];
//   loading: boolean;
//   onEdit?: (product: Product) => void;
//   onDelete?: (product: Product) => void;
//   formatPrice: (price: number) => string;
//   formatDate: (date: string) => string;
// }

// export const ProductTable: React.FC<ProductTableProps> = ({
//   products,
//   loading,
//   onEdit,
//   onDelete,
//   formatPrice,
//   formatDate,
// }) => {
//   if (loading) {
//     return Array(5).fill(0).map((_, index) => (
//       <Skeleton key={index} height="50px" my={2} />
//     ));
//   }

//   if (!products.length) {
//     return (
//       <Box textAlign="center" py={8}>
//         <Text color="gray.500">Không có sản phẩm nào</Text>
//       </Box>
//     );
//   }

//   return (
//     <Table variant="simple">
//       <Thead>
//         <Tr>
//           <Th>Sản phẩm</Th>
//           <Th>Nhóm</Th>
//           <Th>Số lượng</Th>
//           <Th>Giá</Th>
//           <Th>Trạng thái</Th>
//           <Th>Thao tác</Th>
//         </Tr>
//       </Thead>
//       <Tbody>
//         {products.map((product) => (
//           <Tr key={product.id}>
//             <Td>
//               <Flex align="center" gap={3}>
//                 <Image
//                   src={product.productImg || '/placeholder.png'}
//                   alt={product.name}
//                   boxSize="40px"
//                   objectFit="cover"
//                   borderRadius="md"
//                 />
//                 <Box>
//                   <Text fontWeight="medium">{product.name}</Text>
//                   <Text fontSize="sm" color="gray.500">
//                     {formatDate(product.createdDate)}
//                   </Text>
//                 </Box>
//               </Flex>
//             </Td>
//             <Td>{product.groupName}</Td>
//             <Td>{product.quantity}</Td>
//             <Td>{formatPrice(product.price)}</Td>
//             <Td>
//               <Badge
//                 colorScheme={product.status === 'Còn Hàng' ? 'green' : 'red'}
//               >
//                 {product.status}
//               </Badge>
//             </Td>
//             <Td>
//               <Menu>
//                 <MenuButton
//                   as={IconButton}
//                   icon={<Icon as={FiMoreVertical} />}
//                   variant="ghost"
//                   size="sm"
//                 />
//                 <MenuList>
//                   <MenuItem 
//                     icon={<Icon as={FiEdit2} />}
//                     onClick={() => onEdit?.(product)}
//                   >
//                     Chỉnh sửa
//                   </MenuItem>
//                   <MenuItem 
//                     icon={<Icon as={FiTrash2} />}
//                     color="red.500"
//                     onClick={() => onDelete?.(product)}
//                   >
//                     Xóa
//                   </MenuItem>
//                 </MenuList>
//               </Menu>
//             </Td>
//           </Tr>
//         ))}
//       </Tbody>
//     </Table>
//   );
// };