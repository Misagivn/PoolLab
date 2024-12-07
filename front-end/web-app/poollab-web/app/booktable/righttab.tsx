import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";
import { useToast } from "@chakra-ui/react";

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

interface Menu {
  id: string;
  name: string;
  descript: string;
  quantity: number;
  minQuantity: number;
  price: number;
  productImg: string;
  status: string;
}

interface OrderDetail {
  productName: string;
  productId: string;
  quantity: number;
  price: number;
}

const storeId = sessionStorage.getItem("storeId");
const username = sessionStorage.getItem("username");

function RightTab({ selectedTable, menus }: { selectedTable: Table | null; menus: Menu[] }) {
  const toast = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFoodDialog, setShowFoodDialog] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [customerPaid, setCustomerPaid] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [stop, setStop] = useState<boolean>(false);
  const [selectedFoods, setSelectedFoods] = useState<OrderDetail[]>([]);

  // Handle quantity change for a food item
  const handleQuantityChange = (menuId: string, menuName: string, price: number, quantity: number) => {
    setSelectedFoods(prev => {
      const existing = prev.find(f => f.productId === menuId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter(f => f.productId !== menuId);
        }
        return prev.map(f => 
          f.productId === menuId 
            ? { ...f, quantity: quantity }
            : f
        );
      } else if (quantity > 0) {
        return [...prev, {
          productId: menuId,
          productName: menuName,
          quantity: quantity,
          price: price
        }];
      }
      return prev;
    });
  };

  // Handle serving foods to table
  const handleServeFood = async () => {
    if (!selectedTable || selectedFoods.length === 0) {
      toast({
        title: "Vui lòng chọn món",
        status: "warning",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/orderdetail/addnewproducttoorder/${selectedTable.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedFoods)
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
          title: "Phục vụ thành công",
          status: "success",
        });
        setSelectedFoods([]);
        setShowFoodDialog(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        description: "Có lỗi xảy ra khi phục vụ món",
      });
    }
  };

  const handlePaymentOrder = async () => {
    if (!order) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/order/updatecuspayorder/${order.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount: order.discount,
            totalPrice: order.totalPrice,
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
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        description: "Có lỗi xảy ra khi thanh toán",
      });
    }
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
        console.log(error);
        toast({
          status: "error",
          description: "Có lỗi xảy ra khi lấy thông tin hoá đơn",
        });
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
    if (selectedTable) {
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
        console.log(error);
        toast({
          status: "error",
          description: "Có lỗi xảy ra khi kích hoạt bàn",
        });
      }
    }
  };

  const handleStop = async () => {
    if (selectedTable) {
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
        console.log(error);
        toast({
          status: "error",
          description: "Có lỗi xảy ra khi dừng chơi",
        });
      }
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

      <div className={styles.table_order}>
        <p></p>
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
          <button className={styles.add_food_btn} onClick={() => setShowFoodDialog(true)}>
            Thêm món
          </button>
          <button className={styles.stop_btn} onClick={handleStop}>
            Dừng Chơi
          </button>
          <button className={styles.payment_btn} onClick={handleOrder}>
            Thanh Toán
          </button>
        </div>
      )}

      {/* Payment Dialog */}
      {isDialogOpen && order && (
        <div className={styles.dialog_container}>
          <div className={styles.dialog_content}>
            <div className={styles.wrap_head}>
              <h2>Thông tin hoá đơn</h2>
              <button onClick={() => setIsDialogOpen(false)}>X</button>
            </div>

            <div className={styles.order_header}>
              <h2>Khách hàng: {order.username}</h2>
              <p>{order.orderCode}</p>
              <p>{order.orderDate}</p>
            </div>

            <div className={styles.dialog_table}>
              <table className={styles.content_table}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    <th>Số Lượng</th>
                    <th>Giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{order.playTime.name}</td>
                    <td>{order.playTime.totalTime}</td>
                    <td>{order.playTime.totalPrice}</td>
                    <td>{order.playTime.totalPrice}</td>
                  </tr>
                  {order.orderDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>{index + 2}</td>
                      <td>{detail.productName}</td>
                      <td>{detail.quantity}</td>
                      <td>{detail.price}</td>
                      <td>{detail.price * detail.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.payment_info}>
              <h2>Tổng tiền: {order.totalPrice}</h2>
              <div className={styles.payment_input}>
                <label>Khách thanh toán: </label>
                <input
                  type="number"
                  value={customerPaid}
                  onChange={(e) => {
                    const paid = parseFloat(e.target.value) || 0;
                    const price = order.totalPrice ?? 0;
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

      {/* Food Dialog */}
      {showFoodDialog && (
        <div className={styles.dialog_container}>
          <div className={styles.dialog_content}>
            <div className={styles.wrap_head}>
              <h2>Thêm món</h2>
              <button onClick={() => setShowFoodDialog(false)}>X</button>
            </div>

            <div className={styles.dialog_table}>
              <table className={styles.content_table}>
                <thead>
                  <tr>
                    <th>Tên món</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {menus?.map((menu) => (
                    <tr key={menu.id}>
                      <td>{menu.name}</td>
                      <td>{menu.price}</td>
                      <td>
                        <input 
                          type="number"
                          min="0"
                          value={selectedFoods.find(f => f.productId === menu.id)?.quantity || 0}
                          onChange={(e) => handleQuantityChange(
                            menu.id, 
                            menu.name,
                            menu.price,
                            parseInt(e.target.value) || 0
                          )}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.payment1_btn}>
              <button onClick={handleServeFood}>Phục vụ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RightTab;