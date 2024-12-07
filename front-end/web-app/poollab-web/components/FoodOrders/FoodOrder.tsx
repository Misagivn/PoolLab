import React, { useState } from 'react';
import styles from "./layout.module.css";
import { useToast } from "@chakra-ui/react";

interface Menu {
  id: string;
  name: string;
  descript: string;
  quantity: number;
  minQuantity: number;
  price: number;
  productImg: string;
  storeId: string;
  productTypeId: string;
  productTypeName: string;
  productGroupId: string;
  groupName: string;
  unitId: string;
  unitName: string;
  createdDate: string;
  updatedDate: string;
  status: string;
}

interface Table {
  id: string;
  name: string;
  storeId: string;
  areaId: string;
  billiardTypeId: string;
  priceId: string;
  qrcode: string;
  bidaTypeName: string;
  areaName: string;
  createdDate: string;
  updatedDate: string;
  status: string;
}

interface OrderDetail {
  productName: string;
  productId: string;
  quantity: number;
  price: number;
}

interface OrderManagementProps {
  selectedMenu: Menu | null;
  selectedTable: Table | null;
}

const OrderManagement = ({ selectedMenu, selectedTable }: OrderManagementProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const toast = useToast();

  const handleAddToOrder = async () => {
    if (!selectedTable || !selectedMenu) return;
    
    if (selectedTable.status !== "Có Khách") {
      toast({
        title: "Không thể thêm món",
        description: "Bàn phải ở trạng thái có khách",
        status: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/orderdetail/addnewproducttoorder/${selectedTable.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: selectedMenu.name,
            productId: selectedMenu.id,
            quantity: quantity,
            price: selectedMenu.price
          }),
        }
      );

      const data = await response.json();
      if (data.status === 404) {
        toast({
          status: "error",
          description: data.message,
        });
      } else if (data.status === 400) {
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        setOrderDetails(data.data);
        toast({
          title: "Thêm món thành công",
          status: "success",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm món vào order",
        status: "error",
      });
    }
  };

  if (!selectedMenu) return null;

  return (
    <div className={styles.order_section}>
      <div className={styles.order_details}>
        <h3>{selectedMenu.name}</h3>
        <p>{selectedMenu.price.toLocaleString()}đ</p>

        <div className={styles.quantity_control}>
          <label>Số lượng:</label>
          <div className={styles.quantity_buttons}>
            <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
          </div>
        </div>

        <div className={styles.total_price}>
          <p>Tổng cộng:</p>
          <p>{(selectedMenu.price * quantity).toLocaleString()}đ</p>
        </div>

        <button 
          className={styles.serve_button}
          onClick={handleAddToOrder}
        >
          Phục vụ
        </button>
      </div>

      {orderDetails.length > 0 && (
        <div className={styles.order_list}>
          <h4>Chi tiết order:</h4>
          {orderDetails.map((item, index) => (
            <div key={index} className={styles.order_item}>
              <div>
                <p>{item.productName}</p>
                <p>SL: {item.quantity}</p>
              </div>
              <p>{item.price.toLocaleString()}đ</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;