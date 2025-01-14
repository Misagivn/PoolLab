"use client";
import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";
import { useToast } from "@chakra-ui/react";
import RightTab from "./righttab";
import { BidaType } from "@/utils/types/billiardType.types";
import { Area } from "@/utils/types/area.types";
import ProfileDropdown from "@/app/booktable/ProfileDropdown";
import useNotification from "@/hooks/useNotification";
import StaffNotification from "./staffNotiComponent";
import { HubConnectionBuilder } from "@microsoft/signalr";

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

export default function StaffPage() {
  const [activeLeftTab, setActiveLeftTab] = useState("table");
  const [tables, setTables] = useState<Table[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [bidaType, setbidaType] = useState<BidaType[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedBidaType, setSelectedBidaType] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [storeId, setStore] = useState<string | null>("");
  const toast = useToast();

  useEffect(() => {
    const store = sessionStorage.getItem("storeId");
    setStore(store);
    console.log(store);
    // signalRTable();
    if (activeLeftTab === "table") {
      fetchBidaType();
      fetchArea();
      fetchTables();
    } else if (activeLeftTab === "food") {
      fetchFoods();
    }
  }, [activeLeftTab]);

  useEffect(() => {
    signalRTable();
  }, [storeId, selectedTable]);

  const handleAddToOrder = (menu: Menu) => {
    if (!selectedTable) {
      toast({
        title: "Chưa chọn bàn",
        description: "Vui lòng chọn bàn trước khi đặt món",
        status: "warning",
      });
      return;
    }

    if (selectedTable.status !== "Có Khách") {
      toast({
        title: "Không thể đặt món",
        description: "Chỉ có thể đặt món cho bàn đang có khách",
        status: "warning",
      });
      return;
    }

    const existingItem = orderItems.find((item) => item.productId === menu.id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: menu.id,
          productName: menu.name,
          quantity: 1,
          price: menu.price,
        },
      ]);
    }

    toast({
      title: "Đã thêm món",
      description: `Đã thêm ${menu.name} vào order`,
      status: "success",
    });
  };

  const fetchBidaType = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/billiardtype/getallbilliardtype`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === 404) {
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        setbidaType(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchArea = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/area/getallarea?StoreId=${storeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === 404) {
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        setArea(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem("token");
      const stored = sessionStorage.getItem("storeId");
      console.log(token);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/billiardtable/getallbilliardtableforstaff?StroreID=${stored}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(storeId);

      const data = await response.json();
      if (data.status === 404) {
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        setTables(data.data.items);
        // Update selected table if it exists in new data
        if (selectedTable) {
          const updatedTable = data.data.items.find(
            (table: Table) => table.id === selectedTable.id
          );
          if (updatedTable) {
            setSelectedTable(updatedTable);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");
      const status = "Thực đơn";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/Product/GetAllProducts?StoreId=${storeId}&ProductTypeName=${status}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === 404) {
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        setMenus(data.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/billiardtable/getallbilliardtableforstaff?StroreID=${storeId}&AreaID=${selectedArea}&BilliardTypeId=${selectedBidaType}&Status=${selectedStatus}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === 404) {
        toast({
          status: "error",
          description: data.message,
        });
      } else {
        setTables(data.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signalRTable = () => {
    const connect = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_LOCAL_SIGNAL_URL}/notificationHub`) // Thay URL bằng địa chỉ backend của bạn
      .withAutomaticReconnect()
      .build();

    connect
      .start()
      .then(() => {
        console.log("SignalR Connected2!");
        connect
          .invoke("JoinBranchGroup", storeId)
          .then(() => console.log("Successfully joined group2"))
          .catch((err) => console.error(`Error joining group: ${err.message}`));
        console.log("fdgdfgdfg");
        connect.on("TableStatusChanged", (tableId: string, status: string) => {
          console.log(`Table ${tableId} status changed to ${status}`);
          setTables((prevTables) =>
            prevTables.map((table) =>
              table.id === tableId ? { ...table, status: status } : table
            )
          );
          if (selectedTable?.id === tableId) {
            setSelectedTable((prev) =>
              prev ? { ...prev, status: status } : null
            );
          }
        });
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    return () => {
      connect.stop();
    };
  };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveLeftTab("table")}
            className={activeLeftTab === "table" ? styles.active : ""}
          >
            Bàn Bida
          </button>

          <button
            onClick={() => setActiveLeftTab("food")}
            className={activeLeftTab === "food" ? styles.active : ""}
          >
            Thực Đơn
          </button>
        </div>

        <div className={styles.left_content}>
          <div className={styles.left_main}>
            <div className={styles.filter_container}>
              {activeLeftTab === "table" && (
                <form
                  className={styles.table_filter}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleFilter();
                  }}
                >
                  <div className="">
                    <select
                      value={selectedBidaType}
                      onChange={(e) => setSelectedBidaType(e.target.value)}
                    >
                      <option value="" disabled>
                        Chọn loại bàn
                      </option>
                      <option value="">Tất cả</option>
                      {bidaType?.map((items) => (
                        <option value={items.id} key={items.id}>
                          {items.name}
                        </option>
                      ))}
                    </select>
                    <i className="bx bxs-down-arrow"></i>
                  </div>

                  <div className="">
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                    >
                      <option value="" disabled>
                        Chọn khu vực
                      </option>
                      <option value="">Tất cả</option>
                      {area?.map((area) => (
                        <option value={area.id} key={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    <i className="bx bxs-down-arrow"></i>
                  </div>

                  <div className="">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="" disabled>
                        Chọn trạng thái
                      </option>
                      <option value="">Tất cả</option>
                      <option value="Bàn Trống">Bàn Trống</option>
                      <option value="Có Khách">Có Khách</option>
                      <option value="Bàn Đặt">Bàn Đặt</option>
                    </select>
                    <i className="bx bxs-down-arrow"></i>
                  </div>

                  <button type="submit" className={styles.filter_btn}>
                    Tìm kiếm
                  </button>
                </form>
              )}
            </div>

            <div>
              {activeLeftTab === "table" && (
                <div className={styles.card_container}>
                  {Array.isArray(tables) &&
                    tables.map((table) => (
                      <div
                        key={table.id}
                        className={`${styles.card} ${
                          selectedTable?.id === table.id ? styles.selected : ""
                        }`}
                        onClick={() => setSelectedTable(table)}
                      >
                        <div>
                          <img
                            src={table.image}
                            alt="Table image"
                            className={styles.card_img}
                          />
                        </div>

                        <div className={styles.card_content}>
                          <span className={styles.card_status}>
                            <p
                              className={
                                table.status === "Bàn Trống"
                                  ? styles.status_green
                                  : table.status === "Có Khách"
                                  ? styles.status_red
                                  : styles.status_blue
                              }
                            >
                              {table.status}
                            </p>
                          </span>
                          <h4>{table.name}</h4>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {activeLeftTab === "food" && (
                <div className={styles.card_container}>
                  {Array.isArray(menus) &&
                    menus.map((menu) => (
                      <div
                        key={menu.id}
                        className={styles.card}
                        onClick={() => handleAddToOrder(menu)}
                      >
                        <div>
                          <img
                            src={menu.productImg}
                            alt="Menu image"
                            className={styles.card_img}
                          />
                        </div>

                        <div className={styles.card_content}>
                          <span className={styles.card_status}>
                            <p
                              className={
                                menu.status === "Còn Hàng"
                                  ? styles.status_green
                                  : styles.status_red
                              }
                            >
                              {menu.status}
                            </p>
                          </span>
                          <h4>{menu.name}</h4>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.tab2}>
          <button className={styles.right_btn}>Thông Tin</button>
          {/* <button className="profile">Profile</button> */}
          <ProfileDropdown />
        </div>
        <div className={styles.right_content}>
          <RightTab
            selectedTable={selectedTable}
            menus={menus}
            orderItems={orderItems}
            onUpdateOrderItems={setOrderItems}
          />
        </div>
      </div>

      <StaffNotification></StaffNotification>
    </div>
  );
}
