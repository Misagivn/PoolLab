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
  const [bidaType, setbidaType] = useState<BidaType[]>([]);
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
        setbidaType(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    }
  };

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
    }
  };

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
    }
  };

  const handleFilter = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/billiardtable/getallbilliardtable?StroreID=${storeId}&AreaID=${selectedArea}&BilliardTypeId=${selectedBidaType}&Status=${selectedStatus}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(storeId);
      console.log(selectedArea);
      console.log(selectedBidaType);
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
                <form className={styles.table_filter} action={handleFilter}>
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
                    <span className={styles.filter_bidaType}></span>
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
                    <span className={styles.filter_area}></span>
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
                    <span className={styles.filter_status}></span>
                    <i className="bx bxs-down-arrow"></i>
                  </div>

                  <button className={styles.filter_btn}>Tìm kiếm</button>
                </form>
              )}
            </div>
            <div className="">
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
                          ></img>
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
                        //onClick={() => setSelectedTable(menu)}
                      >
                        <div>
                          <img
                            src={menu.productImg}
                            alt="Menu image"
                            className={styles.card_img}
                          ></img>
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
          <RightTab selectedTable={selectedTable} />
        </div>
      </div>
    </div>
  );
}
