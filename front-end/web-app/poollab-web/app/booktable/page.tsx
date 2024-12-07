"use client";
import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";
import { useToast } from "@chakra-ui/react";
import RightTab from "./righttab";
import { BidaType } from "@/utils/types/billiardType.types";
import { Area } from "@/utils/types/area.types";

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

export default function StaffPage() {
  const [activeLeftTab, setActiveLeftTab] = useState("table");
  const [tables, setTables] = useState<Table[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [bidaType, setBidaType] = useState<BidaType[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedBidaType, setSelectedBidaType] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const toast = useToast();

  const storeId = sessionStorage.getItem("storeId");

  useEffect(() => {
    if (activeLeftTab === "table") {
      setSelectedArea("");
      setSelectedBidaType("");
      setSelectedStatus("");
      fetchBidaType();
      fetchArea();
      fetchTables();
    } else if (activeLeftTab === "food") {
      fetchFoods();
    }
  }, [activeLeftTab]);

  // Fetch all bida types
  const fetchBidaType = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/billiardtype/getallbilliardtype`,
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
      } else {
        setBidaType(data.data);
      }
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        description: "Có lỗi xảy ra khi lấy thông tin loại bàn",
      });
    }
  };

  // Fetch all areas
  const fetchArea = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/area/getallarea?StoreId=${storeId}`,
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
      } else {
        setArea(data.data);
      }
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        description: "Có lỗi xảy ra khi lấy thông tin khu vực",
      });
    }
  };

  // Fetch all tables
  const fetchTables = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/billiardtable/getallbilliardtable?StroreID=${storeId}`,
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
      } else {
        setTables(data.data.items);
      }
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        description: "Có lỗi xảy ra khi lấy thông tin bàn",
      });
    }
  };

  // Fetch all foods
  const fetchFoods = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/Product/GetAllProducts?StoreId=${storeId}`,
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
      } else {
        setMenus(data.data.items);
      }
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        description: "Có lỗi xảy ra khi lấy thông tin thực đơn",
      });
    }
  };

  // Handle filtering tables
  const handleFilter = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/billiardtable/getallbilliardtable?StroreID=${storeId}&AreaID=${selectedArea}&BilliardTypeId=${selectedBidaType}&Status=${selectedStatus}`,
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
      } else {
        setTables(data.data.items);
      }
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        description: "Có lỗi xảy ra khi lọc bàn",
      });
    }
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
                <form className={styles.table_filter} onSubmit={(e) => {
                  e.preventDefault();
                  handleFilter();
                }}>
                  <div>
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
                    <span className={styles.filter_bidaType}></span>
                    <i className="bx bxs-down-arrow"></i>
                  </div>

                  <div>
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
                    <span className={styles.filter_area}></span>
                    <i className="bx bxs-down-arrow"></i>
                  </div>

                  <div>
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
                    <span className={styles.filter_status}></span>
                    <i className="bx bxs-down-arrow"></i>
                  </div>

                  <button type="submit" className={styles.filter_btn}>Tìm kiếm</button>
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
                        className={styles.card}
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
          <button className="profile">Profile</button>
        </div>
        <div className={styles.right_content}>
          <RightTab selectedTable={selectedTable} menus={menus} />
        </div>
      </div>
    </div>
  );
}