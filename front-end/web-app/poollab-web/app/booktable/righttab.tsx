import React, { useState, useEffect } from "react";
import styles from "./layout.module.css";
import { Radio, RadioGroup, Stack, useToast } from "@chakra-ui/react";
import { set } from "store";
import { formatDateTime } from "@/utils/format";
import { AccountDTO } from "@/utils/types/account.types";

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
  oldPrice: number;
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

interface OrderedItem {
  id: string;
  productName: string;
  productId: string;
  orderId: string;
  billiardTableId: string;
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
  finalPrice: number | null;
  additionalFee: number;
  paymentMethod: string | null;
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

function RightTab({
  selectedTable,
  menus,
  orderItems,
  onUpdateOrderItems,
}: RightTabProps) {
  const toast = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrderedItemsDialogOpen, setIsOrderedItemsDialogOpen] =
    useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderedItems, setOrderedItems] = useState<OrderedItem[]>([]);
  const [currentOrderedItems, setCurrentOrderedItems] = useState<OrderedItem[]>(
    []
  );
  const [customerPaid, setCustomerPaid] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [stop, setStop] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [storeId, setStore] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [token, setToken] = useState<string | null>("");
  const [paymentMethod, setPaymentMethod] = React.useState<string>("");
  const [isIssuesDialogOpen, setIsIssuesDialogOpen] = useState(false);
  const [searchUsername, setSearchUsername] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountDTO[]>([]);
  const [cusId, setCusId] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [estimateCost, setEstimateCost] = useState<number | null>(null);
  const [issuesStatus, setIssuesStatus] = useState<string | null>(null);
  const [issuesRepairStatus, setIssuesRepairStatus] = useState<string | null>(
    null
  );
  const [issuesPayment, setIssuesPayment] = useState<string | null>(null);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN", { style: "decimal" }) + " ₫";
  };

  useEffect(() => {
    const store = sessionStorage.getItem("storeId");
    setStore(store);
    const username1 = sessionStorage.getItem("username");
    setUsername(username1);
    const token = localStorage.getItem("token");
    setToken(token);
    setStop(true);
    setCustomerPaid(0);
    setChange(0);
    setOrder(null);
    onUpdateOrderItems([]);
    if (selectedTable?.status === "Có Khách") {
      fetchCurrentOrderedItems();
    } else {
      setCurrentOrderedItems([]);
    }
  }, [selectedTable]);

  const fetchCurrentOrderedItems = async () => {
    if (!selectedTable) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/orderdetail/getallorderdetailbytableid/${selectedTable.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === 200) {
        setCurrentOrderedItems(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    onUpdateOrderItems(
      orderItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    onUpdateOrderItems(
      orderItems.filter((item) => item.productId !== productId)
    );
  };

  const handleOrderedItems = async () => {
    if (!selectedTable) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/orderdetail/getallorderdetailbytableid/${selectedTable.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === 200) {
        setOrderedItems(data.data);
        setIsOrderedItemsDialogOpen(true);
      } else {
        toast({
          status: "error",
          description: data.message,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối với máy chủ",
        status: "error",
      });
    }
  };

  const handleServeOrder = async () => {
    if (!selectedTable || !orderItems.length) {
      toast({
        title: "Không thể đặt món",
        description: "Vui lòng chọn món trước khi phục vụ",
        status: "warning",
      });
      return;
    }

    const itemsToOrder = orderItems.map((item) => ({
      productName: item.productName,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price * item.quantity,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/orderdetail/addnewproducttoorder/${selectedTable.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemsToOrder),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        onUpdateOrderItems([]);
        fetchCurrentOrderedItems();
      } else {
        toast({
          title: "Đặt món thất bại",
          description: data.message,
          status: "error",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối với máy chủ",
        status: "error",
      });
    }
  };

  const handlePaymentOrder = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/order/updatecuspayorder/${order?.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            discount: order?.discount,
            totalPrice: order?.totalPrice,
            finalPrice: order?.finalPrice,
            additionalFee: order?.additionalFee,
            customerPay: customerPaid,
            excessCash: change,
            paymentMethod: paymentMethod,
            status: "Hoàn Thành",
          }),
        }
      );

      const data = await response.json();
      if (data.status === 404 || data.status === 400) {
        setIsDialogOpen(true);
        toast({
          status: "error",
          title: "Thất Bại!",
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
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrder = async () => {
    if (selectedTable && stop) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_URL}/order/getorderbyid/${selectedTable.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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

  const fetchAllAccount = async () => {
    if (!selectedTable) return;
    if (!searchUsername || searchUsername.trim() === "") {
      setAccount([]); // Xóa danh sách tài khoản hiện tại
      return;
    }
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_LOCAL_URL
        }/account/getallaccount?UserName=${searchUsername}&RoleName=${"Member"}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === 404 || data.status === 400) {
        setAccount([]);
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        setAccount(data.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTableIssues = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;
    if (!estimateCost || estimateCost <= 0) {
      toast({
        status: "error",
        title: "Thất Bại",
        description: "Số tiền dự kiến phải lớn hơn 0!",
      });
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/tableissues/createtableissues`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            billiardTableID: selectedTable.id,
            customerID: cusId,
            storeId: storeId,
            issueImg: null,
            descript: reason,
            estimatedCost: estimateCost,
            reportedBy: username,
            paymentMethod: issuesPayment,
            status: issuesStatus,
            repairStatus: issuesRepairStatus,
          }),
        }
      );

      const data = await response.json();
      if (data.status === 404 || data.status === 400) {
        toast({
          status: "error",
          title: "Thất Bại",
          description: data.message,
        });
        setIsIssuesDialogOpen(true);
      } else {
        toast({
          status: "success",
          title: "Thành Công",
          description: data.message,
        });
        setCusId(null);
        setReason(null);
        setEstimateCost(null);
        setIssuesStatus(null);
        setIssuesRepairStatus(null);
        setIsIssuesDialogOpen(false);
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
          {/* <img src={selectedTable.image}></img>*/}
          <div className={styles.table_info3}>
            <h2>{selectedTable.name}</h2>
            <p>Loại bàn: {selectedTable.bidaTypeName}</p>
          </div>
          <div className={styles.table_info3}>
            <p>Khu vực: {selectedTable.areaName}</p>
            <p>Giá bàn: {formatCurrency(selectedTable.oldPrice)}</p>
          </div>
          <div className={styles.table_info3}>
            <button onClick={() => setIsIssuesDialogOpen(true)}>
              <i className="bx bxs-report"></i> Báo Cáo
            </button>
          </div>
        </div>
        {/* {selectedTable.status === "Có Khách" && (
          <button 
            className={styles.view_orders_btn}
            onClick={handleOrderedItems}
          >
            Xem món đã đặt
          </button>
        )} */}
      </div>

      <div className={styles.table_order}>
        {selectedTable.status === "Có Khách" && (
          <div className={styles.order_section}>
            <h3>Đặt món</h3>
            {orderItems.length > 0 ? (
              <div className={styles.order_items_container}>
                {orderItems.map((item) => (
                  <div key={item.productId} className={styles.order_item}>
                    <div className={styles.item_name}>
                      {item.productName}
                      <div className={styles.item_price}>
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div className={styles.quantity_controls}>
                      <button
                        className={styles.quantity_btn}
                        onClick={() =>
                          handleUpdateQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantity_btn}
                        onClick={() =>
                          handleUpdateQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className={styles.remove_btn}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
                <div className={styles.order_summary}>
                  <div className={styles.total_amount}>
                    Tổng cộng:{" "}
                    {formatCurrency(
                      orderItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                    )}
                  </div>
                  <button
                    className={styles.serve_button}
                    onClick={handleServeOrder}
                  >
                    Phục vụ
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.ordered_items_container}>
                {currentOrderedItems.length > 0 ? (
                  <>
                    <div className={styles.ordered_items_list}>
                      {currentOrderedItems.map((item) => (
                        <div key={item.id} className={styles.ordered_item}>
                          <div className={styles.item_info}>
                            <span className={styles.item_name}>
                              {item.productName}x{item.quantity}
                            </span>
                          </div>
                          <span className={styles.item_price}>
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>Chưa có món nào được đặt</p>
                )}
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

      {/* Thông tin Hoá đơn */}
      {isDialogOpen && (
        <div className={styles.dialog_container}>
          <div className={styles.dialog_content}>
            <div className={styles.wrap_head}>
              <h2>Thông tin hoá đơn</h2>
              <button onClick={() => setIsDialogOpen(false)}>X</button>
            </div>

            <div className={styles.order_header}>
              <h2>
                Khách hàng: <i className="bx bx-user-circle"></i>{" "}
                {order?.username}
              </h2>
              <p>{order?.orderCode}</p>
              <p>
                <i className="bx bx-calendar"></i>{" "}
                {order?.orderDate && formatDateTime(order.orderDate)}
              </p>
            </div>
            {/* Thông tin hoá đơn */}
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
              {/* Thông tin tiền */}
              <div className={styles.payment_info}>
                <h2>
                  Tổng tiền <p>{formatCurrency(order?.totalPrice || 0)}</p>
                </h2>
                <h2>
                  Phụ phí <p>{formatCurrency(order?.additionalFee || 0)}</p>
                </h2>
                <h2>
                  Khách cần trả{" "}
                  <p className={styles.payment_info_finalprice}>
                    {formatCurrency(order?.finalPrice || 0)}
                  </p>
                </h2>
                <div className={styles.payment_input}>
                  <label>Khách thanh toán </label>
                  <div className={styles.payment_info_cash2}>
                    <input
                      type="number"
                      value={customerPaid === 0 ? "" : customerPaid}
                      onChange={(e) => {
                        const paid = parseFloat(e.target.value) || 0;
                        const price = order?.finalPrice ?? 0;
                        setCustomerPaid(paid);
                        setChange(paid - price);
                      }}
                    />
                    <span>đ</span>
                  </div>
                </div>

                <div className={styles.payment_method}>
                  <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                    <Stack spacing={10} direction="row">
                      <Radio value="Tiền Mặt">Tiền Mặt</Radio>
                      <Radio value="Thẻ">Thẻ</Radio>
                      <Radio value="Chuyển Khoản">Chuyển Khoản</Radio>
                    </Stack>
                  </RadioGroup>
                </div>

                <h2>
                  Tiền thừa{" "}
                  <div className={styles.payment_info_cash}>
                    <input
                      type="number"
                      value={change >= 0 ? change : 0}
                      readOnly
                    />
                    <span>đ</span>
                  </div>
                </h2>
              </div>
            </div>

            <div className={styles.payment1_btn}>
              <button onClick={handlePaymentOrder}>
                <i className="bx bx-dollar"></i> Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {isIssuesDialogOpen && (
        <div className={styles.dialog_container}>
          <div className={styles.dialog_content}>
            <div className={styles.wrap_head}>
              <h2>Báo Cáo Hư Hỏng</h2>
              <button onClick={() => setIsIssuesDialogOpen(false)}>X</button>
            </div>
            <div className={styles.issues_content}>
              <div className="">
                <div className={styles.issues_input}>
                  <label htmlFor="">Khách Hàng</label>
                  <input
                    type="text"
                    value={searchUsername}
                    placeholder="Nhập tên đăng nhập"
                    onChange={(e) => {
                      setSearchUsername(e.target.value);
                    }}
                  />
                  <button onClick={() => fetchAllAccount()}>
                    <i className="bx bx-search-alt-2"></i> Tìm
                  </button>
                </div>
                <div className={styles.issues_card}>
                  {account.length > 0 &&
                    account.map((acc) => (
                      <div className={styles.issues_card_info} key={acc.id}>
                        <img src={acc.avatarUrl} alt="Hình đại diện" />
                        <div className={styles.issues_acc_info}>
                          <h2>
                            {acc.userName}{" "}
                            {acc.id === cusId && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="20"
                                height="20"
                                viewBox="0 0 30 30"
                              >
                                <path d="M 15 3 C 8.4 3 3 8.4 3 15 C 3 21.6 8.4 27 15 27 C 21.6 27 27 21.6 27 15 C 27 12.8 26.400391 10.8 25.400391 9 L 14.099609 20.300781 C 13.899609 20.500781 13.700391 20.599609 13.400391 20.599609 C 13.100391 20.599609 12.899219 20.500781 12.699219 20.300781 L 8.1992188 15.800781 C 7.7992188 15.400781 7.7992187 14.800391 8.1992188 14.400391 C 8.5992187 14.000391 9.1996094 14.000391 9.5996094 14.400391 L 13.400391 18.199219 L 24.199219 7.3007812 C 21.999219 4.7007813 18.7 3 15 3 z M 24.199219 7.3007812 C 24.699219 7.8007813 25.100391 8.4 25.400391 9 L 27.699219 6.6992188 C 28.099219 6.2992188 28.099219 5.6992188 27.699219 5.1992188 C 27.299219 4.7992188 26.700781 4.7992187 26.300781 5.1992188 L 24.199219 7.3007812 z"></path>
                              </svg>
                            )}
                          </h2>
                          <p
                            className={
                              acc.status === "Kích Hoạt"
                                ? styles.iss_acc_active
                                : styles.iss_acc_inactive
                            }
                          >
                            {acc.status}
                          </p>
                        </div>
                        <div className={styles.issues_acc_btn}>
                          <button onClick={() => setCusId(acc.id)}>Chọn</button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <form
                className={styles.issues_info_right}
                onSubmit={handleTableIssues}
              >
                <div className={styles.issues_right_content}>
                  <textarea
                    name=""
                    id="Description"
                    value={reason === null ? "" : reason}
                    rows={5}
                    cols={50}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập mô tả về lý do hư hại..."
                    required
                  ></textarea>

                  <div className={styles.issues_cost}>
                    <label htmlFor="">Chi phí dự kiến</label>
                    <input
                      required
                      type="number"
                      value={estimateCost === null ? "" : estimateCost}
                      onChange={(e) => setEstimateCost(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.payment_method1}>
                    <RadioGroup onChange={setIssuesStatus} value={issuesStatus}>
                      <Stack spacing={10} direction="row">
                        <Radio value="Tích Hợp">Tích Hợp Hoá Đơn</Radio>
                        <Radio value="Thanh Toán">Thanh Toán</Radio>
                        <Radio value="Báo Cáo">Báo Cáo</Radio>
                      </Stack>
                    </RadioGroup>
                  </div>

                  <div className={styles.payment_method1}>
                    <RadioGroup
                      onChange={setIssuesPayment}
                      value={issuesPayment}
                    >
                      <Stack spacing={10} direction="row">
                        <Radio value="Tiền Mặt">Tiền Mặt</Radio>
                        <Radio value="Thẻ">Thẻ</Radio>
                        <Radio value="Chuyển Khoản">Chuyển Khoản</Radio>
                      </Stack>
                    </RadioGroup>
                  </div>

                  <div className={styles.payment_method1}>
                    <RadioGroup
                      onChange={setIssuesRepairStatus}
                      value={issuesRepairStatus}
                    >
                      <Stack spacing={10} direction="row">
                        <Radio value="Bảo Trì">Cần Bảo Trì</Radio>
                        <Radio value="">Không Cần Bảo Trì</Radio>
                      </Stack>
                    </RadioGroup>
                  </div>
                </div>

                <div className={styles.issues_btn_report}>
                  <button type="submit">
                    <i className="bx bxs-report"></i> Tạo Báo Cáo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* {isOrderedItemsDialogOpen && (
        <div className={styles.dialog_container}>
          <div className={styles.dialog_content}>
            <div className={styles.wrap_head}>
              <h2>Danh sách món đã đặt</h2>
              <button onClick={() => setIsOrderedItemsDialogOpen(false)}>X</button>
            </div>

            <div className={styles.dialog_table}>
              <table className={styles.content_table}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên món</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.total_amount}>
                Tổng cộng: {formatCurrency(
                  orderedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                )}
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* {showSuccessMessage && (
        <div className={styles.success_message}>Đặt món thành công</div>
      )} */}
    </div>
  );
}

export default RightTab;
