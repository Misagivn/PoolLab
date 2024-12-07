import React, { useState, useEffect } from "react";
import styles from "./layout.module.css";
import { useToast } from "@chakra-ui/react";

interface Table {
  id: string;
  name: string;
  descript: string;
  image: string;
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

interface OrderItem {
  productName: string;
  productId: string;
  quantity: number;
  price: number;
}

interface Playtime {
  id: string;
  name: string;
  billiardTableId: string;
  timeStart: string;
  timeEnd: string;
  totalTime: number;
  totalPrice: number;
  status: string;
}

interface Order {
  id: string;
  orderCode: string;
  username: string;
  billiardTableId: string;
  storeId: string;
  storeName: string;
  address: string;
  playTime: Playtime;
  orderDetails: OrderDetail[];
  orderDate: string;
  orderBy: string;
  discount: number;
  totalPrice: number | null;
  customerPay: number;
  excessCash: number;
  status: string;
}

interface OrderDetail {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface RightTabProps {
  selectedTable: Table | null;
  menus: Menu[];
  orderItems: OrderItem[];
  onUpdateOrderItems: (items: OrderItem[]) => void;
}

const storeId = sessionStorage.getItem("storeId");
const username = sessionStorage.getItem("username");

function RightTab({ selectedTable, menus, orderItems, onUpdateOrderItems }: RightTabProps) {
  const toast = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [customerPaid, setCustomerPaid] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [stop, setStop] = useState<boolean>(false);
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('vi-VN', { style: 'decimal' }) + ' ₫';
  };

  useEffect(() => {
    // Reset states when table changes
    setStop(false);
    setCustomerPaid(0);
    setChange(0);
    setOrder(null);
    onUpdateOrderItems([]);
  }, [selectedTable]);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    onUpdateOrderItems(
      orderItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    onUpdateOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const handleServeOrder = async () => {
    if (!selectedTable || !orderItems.length) {
      toast({
        title: "Không thể đặt món",
        description: "Vui lòng chọn món trước khi phục vụ",
        status: "warning"
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/orderdetail/addnewproducttoorder/${selectedTable.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderItems)
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Đặt món thành công",
          status: "success"
        });
        onUpdateOrderItems([]);
      } else {
        toast({
          title: "Đặt món thất bại",
          description: data.message,
          status: "error"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối với máy chủ",
        status: "error"
      });
    }
  };

  const handlePaymentOrder = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/order/updatecuspayorder/${order?.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount: order?.discount,
            totalPrice: order?.totalPrice,
            customerPay: customerPaid,
            excessCash: change,
            status: "Hoàn Thành",
          }),
        }
      );

      const data = await response.json();
      if (data.status === 404 || data.status === 400) {
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        toast({
          title: "Thanh Toán Thành Công",
          description: data.message,
          status: "success",
        });
        setCustomerPaid(0);
        setChange(0);
        setStop(false);
      }
    } catch (error) {
      console.error(error);
    }
    setIsDialogOpen(false);
  };

  const handleOrder = async () => {
    if (selectedTable && stop) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_URL}/order/getorderbyid/${selectedTable.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        if (data.status === 404 || data.status === 400) {
          toast({
            status: "error",
            description: data.message,
          });
        } else {
          setOrder(data.data);
          setIsDialogOpen(true);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      toast({
        title: "Thanh toán thất bại!",
        description: "Bạn cần dừng thời gian chơi trước khi thanh toán.",
        status: "error",
      });
    }
  };

  const handleActivate = async () => {
    if (!selectedTable) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/billiardtable/activatetableforguest/${selectedTable.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeId: storeId, staffName: username }),
        }
      );

      const data = await response.json();
      if (data.status === 404 || data.status === 400) {
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        toast({
          title: "Kích Hoạt Thành Công",
          description: data.message,
          status: "success",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStop = async () => {
    if (!selectedTable) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/playtime/stopplaytime`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            billiardTableID: selectedTable.id,
            customerID: null,
            customerTime: null,
          }),
        }
      );

      const data = await response.json();
      if (data.status === 404 || data.status === 400) {
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        toast({
          title: "Dừng Chơi Thành Công",
          description: data.message,
          status: "success",
        });
        setStop(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!selectedTable) return null;

  return (
    <div className={styles.right_main}>
      <div className={styles.table_info}>
        <div className={styles.table_info2}>
          <h2>{selectedTable.name}</h2>
          <h2>{selectedTable.bidaTypeName}</h2>
          <h2>{selectedTable.areaName}</h2>
        </div>
      </div>

      {/* <div className={styles.table_order}>
        {selectedTable.status === "Có Khách" && (
          <div className={styles.order_section}>
            <h3>Đặt món</h3>
            <div className={styles.selected_items}>
              {orderItems.length > 0 ? (
                <>
                  {orderItems.map((item) => (
                    <div key={item.productId} className={styles.selected_item}>
                      <span>{item.productName}</span>
                      <div className={styles.item_controls}>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className={styles.quantity_input}
                        />
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className={styles.remove_button}
                        >
                          Xóa
                        </button>
                      </div>
                      <span>{item.price * item.quantity} đ</span>
                    </div>
                  ))}
                  <div className={styles.order_total}>
                    Tổng cộng: {orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)} đ
                  </div>
                  <button
                    className={styles.serve_button}
                    onClick={handleServeOrder}
                  >
                    Phục vụ
                  </button>
                </>
              ) : (
                <p>Chưa có món nào được chọn</p>
              )}
            </div>
          </div>
        )}
      </div> */}

<div className={styles.table_order}>
  {selectedTable.status === "Có Khách" && (
    <div className={styles.order_section}>
      <h3>Đặt món</h3>
      <div className={styles.order_items_container}>
        {orderItems.length > 0 ? (
          orderItems.map((item) => (
            <div key={item.productId} className={styles.order_item}>
              <div className={styles.item_info}>
                <div className={styles.item_name}>{item.productName}</div>
                <div className={styles.item_price}>{formatCurrency(item.price * item.quantity)}</div>
              </div>
              <div className={styles.quantity_controls}>
                <button
                  className={styles.quantity_btn}
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                  className={styles.quantity_input}
                  min="1"
                />
                <button
                  className={styles.quantity_btn}
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className={styles.remove_btn}
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có món nào được chọn</p>
        )}
      </div>

      {orderItems.length > 0 && (
        <div className={styles.order_summary}>
          <div className={styles.total_amount}>
          Tổng cộng: {formatCurrency(
                    orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
                  )}
          </div>
          <button className={styles.serve_button} onClick={handleServeOrder}>
            Phục vụ
          </button>
        </div>
      )}
    </div>
  )}
</div>

      {selectedTable.status === "Bàn Trống" && (
        <div className={styles.table_btn}>
          <button className={styles.active1_btn} onClick={handleActivate}>
            Kích Hoạt
          </button>
        </div>
      )}

      {selectedTable.status === "Có Khách" && (
        <div className={styles.table_btn}>
          <button className={styles.stop_btn} onClick={handleStop}>
            Dừng Chơi
          </button>
          <button className={styles.payment_btn} onClick={handleOrder}>
            Thanh Toán
          </button>
        </div>
      )}

      {isDialogOpen && (
        <div className={styles.dialog_container}>
          <div className={styles.dialog_content}>
            <div className={styles.wrap_head}>
              <h2>Thông tin hoá đơn</h2>
              <button onClick={() => setIsDialogOpen(false)}>X</button>
            </div>

            <div className={styles.order_header}>
              <h2>Khách hàng: {order?.username}</h2>
              <p>{order?.orderCode}</p>
              <p>{order?.orderDate}</p>
            </div>

            <div className={styles.dialog_table}>
              <table className={styles.content_table}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    <th>Số Lượng</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{order?.playTime.name}</td>
                    <td>{order?.playTime.totalTime}</td>
                    <td>{formatCurrency(order?.playTime.totalPrice || 0)}</td>
                  </tr>
                  {order?.orderDetails.map((detail, index) => (
                    <tr key={detail.id}>
                      <td>{index + 2}</td>
                      <td>{detail.productName}</td>
                      <td>{detail.quantity}</td>
                      <td>{formatCurrency(detail.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.payment_info}>
              <h2>Tổng tiền: {order?.totalPrice} đ</h2>
              <div className={styles.payment_input}>
                <label>Khách thanh toán: </label>
                <input
                  type="number"
                  value={customerPaid}
                  onChange={(e) => {
                    const paid = parseFloat(e.target.value) || 0;
                    const price = order?.totalPrice ?? 0;
                    setCustomerPaid(paid);
                    setChange(paid - price);
                  }}
                />
              </div>
              <h2>
                Tiền thừa:{" "}
                <input
                  type="number"
                  value={change >= 0 ? change : 0}
                  readOnly
                />
              </h2>
            </div>

            <div className={styles.payment1_btn}>
              <button onClick={handlePaymentOrder}>Thanh toán</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RightTab;