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
  orderDetails: [];
  orderDate: string;
  orderBy: string;
  discount: number;
  totalPrice: number | null;
  customerPay: number;
  excessCash: number;
  status: string;
}

const storeId = sessionStorage.getItem("storeId");
const username = sessionStorage.getItem("username");

function RightTab({ selectedTable }: { selectedTable: Table | null }) {
  const toast = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>();
  const [customerPaid, setCustomerPaid] = useState<number>(0); // Tiền khách trả
  const [change, setChange] = useState<number>(0); // Tiền thừa
  const [stop, setStop] = useState<boolean>(false);

  const handlePaymentOrder = async () => {
    // Call activation API
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
        toast({
          title: "Thanh Toán Thành Công",
          description: data.message,
          status: "success",
        });
        setCustomerPaid(0);
        setChange(0);
      }
    } catch (error) {
      console.log(error);
    }
    setIsDialogOpen(false);
  };

  //Lấy hoá đơn
  const handleOrder = async () => {
    if (selectedTable && stop) {
      // Call activation API
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_URL}/order/getorderbyid/${selectedTable.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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
          setOrder(data.data);
          setIsDialogOpen(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast({
        title: "Thanh toán thất bại!",
        description: "Bạn cần dừng thời gian chơi trước khi thanh toán.",
        status: "error",
      });
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  //Kich hoat ban
  const handleActivate = async () => {
    if (selectedTable) {
      // Call activation API
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
          toast({
            title: "Kích Hoạt Thành Công",
            description: data.message,
            status: "success",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Dừng giờ chơi
  const handleStop = async () => {
    if (selectedTable) {
      // Call activation API
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
          toast({
            title: "Dừng Chơi Thành Công",
            description: data.message,
            status: "success",
          });
          setStop(true);
        }
      } catch (error) {
        console.log(error);
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
          <button className={styles.stop_btn} onClick={handleStop}>
            Dừng Chơi
          </button>
          <button className={styles.payment_btn} onClick={handleOrder}>
            Thanh Toán
          </button>
        </div>
      )}

      {/* Dialog Box */}
      {isDialogOpen && (
        <div className={styles.dialog_container}>
          <div className={styles.dialog_content}>
            <div className={styles.wrap_head}>
              <h2></h2>
              <h2>Thông tin hoá đơn</h2>
              <button onClick={closeDialog}>X</button>
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
                    <th>Name</th>
                    <th>Số Lượng</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{order?.playTime.name}</td>
                    <td>{order?.playTime.totalTime}</td>
                    <td>{order?.playTime.totalPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="">
              <h2>Tổng tiền: {order?.totalPrice}</h2>
              <div>
                <label htmlFor="">Khách thanh toán: </label>
                <input
                  type="number"
                  value={customerPaid}
                  onChange={(e) => {
                    const paid = parseFloat(e.target.value) || 0; // Chuyển đổi giá trị nhập vào thành số
                    const price = order?.totalPrice ?? 0;
                    setCustomerPaid(paid);
                    setChange(paid - price); // Tính tiền thừa
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
