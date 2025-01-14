import React, { useEffect, useState } from "react";
import {
  User,
  Settings,
  HelpCircle,
  Moon,
  MessageSquare,
  LogOut,
  Airplay,
} from "lucide-react";
import styles from "./layout.module.css";
import { accountApi } from "@/apis/account.api";
import { useToast } from "@chakra-ui/react";
import { AccountDTO } from "@/utils/types/account.types";
import { Console } from "console";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { TableIssuesDTO } from "@/utils/types/tableIssues.types";
import { ClassNames } from "@emotion/react";
import { TableMaintenanceDTO } from "@/utils/types/tableMaintenace1.types";
import { set } from "store";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogProfileOpen, setIsDialogProfileOpen] = useState(false);
  const [isDialogTableIssues, setIsDialogTableIssues] = useState(false);
  const [isIssuesDetail, setIsIssuesDetail] = useState(false);
  const [isDialogTabbleMain, setIsDialogTableMain] = useState(false);
  const [isMainDetail, setIsMainDetail] = useState(false);
  const [isDialogProfileUpdate, setIsDialogProfileUpdate] = useState(false);

  const [profile, setProfile] = useState<AccountDTO>();
  const [tableIssues, setTableIssues] = useState<TableIssuesDTO[]>([]);
  const [tableIssuesDetail, setTableIssuesDetail] =
    useState<TableIssuesDTO | null>(null);

  const [tableMain, setTableMain] = useState<TableMaintenanceDTO[]>([]);
  const [tableMainDetail, setTableMainDetail] =
    useState<TableMaintenanceDTO | null>(null);

  const [searchIssCode, setSearchIssCode] = useState<string | null>("");
  const [searchIssStatus, setSearchIssStatus] = useState<string | null>("");
  const [searchMainCode, setSearchMainCode] = useState<string | null>("");
  const [searchMainStatus, setSearchMainStatus] = useState<string | null>("");
  const [totalPage, setTotalPage] = useState<number[]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const toast = useToast();

  const token = localStorage.getItem("token");
  const accountId = sessionStorage.getItem("accountId");
  const role = sessionStorage.getItem("role");
  const store = sessionStorage.getItem("storeId");
  const handleLogout = () => {
    // Xử lý đăng xuất
    sessionStorage.clear();
    window.location.href = "/";
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/account/getaccountbyid/${accountId}`,
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
        toast({
          title: "Thành Công",
          description: data.message,
          status: "success",
        });
        setProfile(data.data);
        console.log(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTableIssues = async () => {
    try {
      if (searchIssCode === null) {
        setSearchIssStatus("");
      }
      console.log(totalPage);
      console.log(currPage);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/tableissues/getalltableissues?StoreId=${store}&RepairStatus=${searchIssStatus}&TableIssuesCode=${searchIssCode}&SortBy=createdDate&SortAscending=false&PageSize=6&PageNumber=${currPage}`,
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
        console.log(
          "${process.env.NEXT_PUBLIC_LOCAL_URL}/tableissues/getalltableissues?StoreId=${store}&RepairStatus=${searchIssStatus}&TableIssuesCode=${searchIssCode}&SortBy=createdDate&SortAscending=false&PageSize=6"
        );
        toast({
          status: "error",
          description: data.message,
        });
        setTableIssues([]);
        setTotalPage([]);
      } else {
        setTableIssues(data.data.items);
        const page = [];
        for (let index = 1; index <= data.data.totalPages; index++) {
          page.push(index);
        }
        setTotalPage(page);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTableMain = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/tablemaintenance/getalltablemaintenance?StoreId=${store}&SortAscending=false&PageSize=6&PageNumber=${currPage}&TableMainCode=${searchMainCode}&Status=${searchMainStatus}`,
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
        setTableMain([]);
        setTotalPage([]);
      } else {
        setTableMain(data.data.items);
        console.log(tableMain);
        const page1 = [];
        for (let index = 1; index <= data.data.totalPages; index++) {
          page1.push(index);
        }
        setTotalPage(page1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatusMain = async (
    tableMainId: string,
    status: string
  ) => {
    try {
      // if (tableMainId === "" || tableMainId.trim() === "") {
      //   toast({
      //     status: "error",
      //     description: "Hãy chọn 1 báo cáo trước khi cập nhật!",
      //   });
      //   return;
      // }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/tablemaintenance/updatetablemaintenancestatus/${tableMainId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: status }),
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
          status: "success",
          title: "Thành Công",
          description: "Cập nhật thành công.",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (confirmPassword !== newPassword) {
        toast({
          status: "error",
          description: "Mật khẩu mới và xác nhận mật khẩu không trùng nhau!",
        });
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/account/updatepassword/${accountId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: confirmPassword,
          }),
        }
      );

      const data = await response.json();
      if (data.status === 404 || data.status === 400) {
        toast({
          status: "error",
          description: data.message,
        });
        setIsDialogProfileUpdate(true);
      } else {
        toast({
          status: "success",
          title: "Thành Công",
          description: "Cập nhật thành công.",
        });
        setIsDialogProfileUpdate(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.profile_container}>
      <button
        className={styles.profile_button}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bx bx-menu"></i>
      </button>

      {isOpen && (
        <div className={styles.dropdown_menu}>
          <div className={styles.user_info}>
            <div className={styles.avatar}>
              <User size={32} />
            </div>
            <span className={styles.username}>
              {sessionStorage.getItem("username") || "User"}
            </span>
          </div>

          <div className={styles.dropdown_divider} />

          <button
            className={styles.dropdown_item}
            onClick={() => {
              setIsDialogProfileOpen(true);
              fetchProfile();
            }}
          >
            <User size={20} />
            <span>Trang cá nhân</span>
          </button>

          <button
            className={styles.dropdown_item}
            onClick={() => {
              setIsDialogTableIssues(true);
              fetchTableIssues();
            }}
          >
            <Airplay size={20} />
            <span>Thông tin bàn hư hỏng</span>
          </button>

          <button
            className={styles.dropdown_item}
            onClick={() => {
              setIsDialogTableMain(true);
              fetchTableMain();
            }}
          >
            <MessageSquare size={20} />
            <span>Danh sách bàn bảo trì</span>
          </button>

          <div className={styles.dropdown_divider} />

          <button className={styles.dropdown_item} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}

      {isDialogProfileOpen && (
        <div className={styles.profile_dialog}>
          <div className={styles.profile_dialog_content}>
            <div className={styles.wrap_head}>
              <h2>Thông tin tài khoản</h2>
              <button onClick={() => setIsDialogProfileOpen(false)}>X</button>
            </div>

            <div className={styles.profile_content}>
              <div className={styles.profile_avatar}>
                <img src={profile?.avatarUrl} alt="Ảnh Chân Dung" />
              </div>
              <div className={styles.profile_info}>
                <h2>{profile?.userName}</h2>
                <div className={styles.profile_input}>
                  <label>Họ và Tên</label>
                  <input
                    type="text"
                    value={profile?.fullName === null ? "" : profile?.fullName} // Hiển thị rỗng nếu giá trị là 0
                    readOnly
                  />
                </div>
                <div className={styles.profile_input}>
                  <label>Email</label>
                  <input
                    type="text"
                    value={profile?.email === null ? "" : profile?.email} // Hiển thị rỗng nếu giá trị là 0
                    readOnly
                  />
                </div>
                <div className={styles.profile_input}>
                  <label>Số Điện Thoại</label>
                  <input
                    type="text"
                    value={
                      profile?.phoneNumber === null ? "" : profile?.phoneNumber
                    } // Hiển thị rỗng nếu giá trị là 0
                    readOnly
                  />
                </div>
              </div>
              <div className={styles.profile_info2}>
                <div className={styles.profile_update_btn}>
                  <button
                    className={styles.update_profile_btn}
                    onClick={() => setIsDialogProfileUpdate(true)}
                  >
                    <svg
                      className="feather feather-edit"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>{" "}
                    <p>Cập nhật mật khẩu</p>
                  </button>
                </div>
                <div className={styles.profile_input}>
                  <label>Chức Vụ</label>
                  <input
                    type="text"
                    value={role === "Staff" ? "Nhân Viên" : ""} // Hiển thị rỗng nếu giá trị là 0
                    readOnly
                  />
                </div>
                <div className={styles.profile_input}>
                  <label>Trạng Thái</label>
                  <input
                    type="text"
                    value={profile?.status === null ? "" : profile?.status} // Hiển thị rỗng nếu giá trị là 0
                    readOnly
                  />
                </div>
                <div className={styles.profile_input}>
                  <label>Tham Gia</label>
                  <input
                    type="text"
                    value={
                      profile?.joinDate && formatDateTime(profile.joinDate)
                    } // Hiển thị rỗng nếu giá trị là 0
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDialogTableIssues && (
        <div className={styles.profile_dialog}>
          <div className={styles.profile_dialog_content}>
            <div className={styles.wrap_head}>
              <h2>Danh sách báo cáo hư hỏng</h2>
              <button
                onClick={() => {
                  setIsDialogTableIssues(false);
                  setTotalPage([]);
                  setCurrPage(1);
                }}
              >
                X
              </button>
            </div>

            <div className="">
              <div className={styles.tableIssues_filter}>
                <input
                  type="text"
                  value={searchIssCode === null ? "" : searchIssCode}
                  placeholder="Nhập mã báo cáo..."
                  onChange={(e) => setSearchIssCode(e.target.value)}
                />
                <div className={styles.tableIssues_filter_select}>
                  <select
                    value={searchIssStatus}
                    onChange={(e) => setSearchIssStatus(e.target.value)}
                  >
                    <option value="" disabled>
                      Chọn trạng thái
                    </option>
                    <option value="">Tất cả</option>
                    <option value="Chưa Xử Lý">Chưa Xử Lý</option>
                    <option value="Đã Xử Lý">Đã Xử Lý</option>
                    <option value="Hoàn Thành">Hoàn Thành</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setCurrPage(1);
                    fetchTableIssues();
                  }}
                >
                  <i className="bx bx-search-alt-2"></i> Tìm kiếm
                </button>
              </div>
              <div className={styles.tableIssues_list}>
                {tableIssues.length > 0 && (
                  <table className={styles.content_table1}>
                    <thead>
                      <tr>
                        <th>Mã Báo Cáo</th>
                        <th>Tên Bàn</th>
                        <th>Giá</th>
                        <th>Ngày Tạo</th>
                        <th>Hình Thức</th>
                        <th>Trạng Thái</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableIssues.map((table1) => (
                        <tr key={table1.id}>
                          <td>{table1.tableIssuesCode}</td>
                          <td>{table1.billiardName}</td>
                          <td>{table1.estimatedCost}</td>
                          <td>{formatDateTime(table1.createdDate)}</td>
                          <td>{table1.status}</td>
                          <td>{table1.repairStatus}</td>
                          <td>
                            <button
                              onClick={() => {
                                setTableIssuesDetail(table1);
                                setIsIssuesDetail(true);
                              }}
                            >
                              <i className="bx bx-message-alt-detail"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr></tr>
                    </tbody>
                  </table>
                )}
              </div>

              <div className={styles.issues_paging}>
                {totalPage.length > 0 &&
                  totalPage.map((page) => (
                    <div key={page} className={styles.issues_page_input}>
                      <input
                        type="number"
                        value={page}
                        readOnly
                        onClick={() => {
                          setCurrPage(page);
                          fetchTableIssues();
                        }}
                        className={
                          page === currPage
                            ? styles.issues_page_input_active
                            : styles.issues_page_input_inactive
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isIssuesDetail && (
        <div className={styles.profile_dialog1}>
          <div className={styles.profile_dialog_content1}>
            <div className={styles.wrap_head}>
              <h2>Thông tin báo cáo</h2>
              <button onClick={() => setIsIssuesDetail(false)}>X</button>
            </div>

            {tableIssuesDetail !== null && (
              <div className={styles.tableIssues_info}>
                <div className={styles.tableIssues_input_header}>
                  <label>
                    Mã Báo Cáo: {tableIssuesDetail?.tableIssuesCode}
                  </label>
                  <p>
                    {tableIssuesDetail === null
                      ? ""
                      : formatDateTime(tableIssuesDetail.createdDate)}
                  </p>
                </div>

                <div className={styles.tableIssues_input_detail}>
                  <p>Khách hàng </p>
                  <h2>
                    <i className="bx bx-user-circle"></i>
                    {""}
                    {tableIssuesDetail.username === null &&
                    tableIssuesDetail.status !== "Báo Cáo"
                      ? "Khách Lẻ"
                      : tableIssuesDetail.username}
                  </h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Tên bàn </p>
                  <h2>
                    <i className="bx bx-table"></i>{" "}
                    {tableIssuesDetail.billiardName}
                  </h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Tạo bởi </p>
                  <h2>
                    <i className="bx bx-user"></i>{" "}
                    {tableIssuesDetail.reportedBy}
                  </h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Giá dự kiến </p>
                  <h2>
                    <i className="bx bx-dollar-circle"></i>{" "}
                    {formatCurrency(tableIssuesDetail.estimatedCost)}
                  </h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Phương thức thanh toán </p>
                  <h2>{tableIssuesDetail.paymentMethod}</h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Hình thức </p>
                  <h2>{tableIssuesDetail.status}</h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Trạng thái </p>
                  <h2>{tableIssuesDetail.repairStatus}</h2>
                </div>
                <div className={styles.tableIssue_descript_info}>
                  <p>Mô tả</p>
                  <textarea
                    name=""
                    id="Description"
                    value={
                      tableIssuesDetail?.descript === null
                        ? ""
                        : tableIssuesDetail?.descript
                    }
                    rows={4}
                    cols={50}
                    readOnly
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isDialogTabbleMain && (
        <div className={styles.profile_dialog}>
          <div className={styles.profile_dialog_content}>
            <div className={styles.wrap_head}>
              <h2>Danh sách bàn bảo trì</h2>
              <button
                onClick={() => {
                  setIsDialogTableMain(false);
                  setTotalPage([]);
                  setCurrPage(1);
                }}
              >
                X
              </button>
            </div>

            <div className="">
              <div className={styles.tableIssues_filter}>
                <input
                  type="text"
                  value={searchMainCode === null ? "" : searchMainCode}
                  placeholder="Nhập mã bảo trì..."
                  onChange={(e) => setSearchMainCode(e.target.value)}
                />
                <div className={styles.tableIssues_filter_select}>
                  <select
                    value={searchMainStatus}
                    onChange={(e) => setSearchMainStatus(e.target.value)}
                  >
                    <option value="" disabled>
                      Chọn trạng thái
                    </option>
                    <option value="">Tất cả</option>
                    <option value="Đã Tạo">Đã Tạo</option>
                    <option value="Hoàn Thành">Hoàn Thành</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setCurrPage(1);
                    fetchTableMain();
                  }}
                >
                  <i className="bx bx-search-alt-2"></i> Tìm kiếm
                </button>
              </div>
              <div className={styles.tableIssues_list}>
                {tableMain.length > 0 && (
                  <table className={styles.content_table1}>
                    <thead>
                      <tr>
                        <th>Mã Bão Trì</th>
                        <th>Tên Bàn</th>
                        <th>Nhân Viên</th>
                        <th>Giá</th>
                        <th>Ngày Bắt Đầu</th>
                        <th>Ngày Kết Thúc</th>
                        <th>Trạng Thái</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableMain.map((table1) => (
                        <tr key={table1.id}>
                          <td>{table1.tableMainCode}</td>
                          <td>{table1.tableName}</td>
                          <td>{table1.staffName}</td>
                          <td>{formatCurrency(table1.estimatedCost)}</td>
                          <td>{formatDateTime(table1.startDate)}</td>
                          <td>{formatDateTime(table1.endDate)}</td>
                          <td>{table1.status}</td>
                          <td>
                            <button
                              onClick={() => {
                                setIsMainDetail(true);
                                setTableMainDetail(table1);
                              }}
                            >
                              <svg
                                height="27"
                                viewBox="0 0 24 24"
                                width="27"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.767L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14h-7.277L9 18.233V16H4V4h16v12z" />
                                <path d="M7 7h10v2H7zm0 4h7v2H7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                handleUpdateStatusMain(table1.id, "Hoàn Thành");
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="30"
                                height="30"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  fill="#c8e6c9"
                                  d="M36,42H12c-3.314,0-6-2.686-6-6V12c0-3.314,2.686-6,6-6h24c3.314,0,6,2.686,6,6v24C42,39.314,39.314,42,36,42z"
                                ></path>
                                <path
                                  fill="#4caf50"
                                  d="M34.585 14.586L21.014 28.172 15.413 22.584 12.587 25.416 21.019 33.828 37.415 17.414z"
                                ></path>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr></tr>
                    </tbody>
                  </table>
                )}
              </div>

              <div className={styles.issues_paging}>
                {totalPage.length > 0 &&
                  totalPage.map((page) => (
                    <div key={page} className={styles.issues_page_input}>
                      <input
                        type="number"
                        value={page}
                        readOnly
                        onClick={() => {
                          setCurrPage(page);
                          fetchTableMain();
                        }}
                        className={
                          page === currPage
                            ? styles.issues_page_input_active
                            : styles.issues_page_input_inactive
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isMainDetail && (
        <div className={styles.profile_dialog1}>
          <div className={styles.profile_dialog_content1}>
            <div className={styles.wrap_head}>
              <h2>Thông tin bảo trì</h2>
              <button onClick={() => setIsMainDetail(false)}>X</button>
            </div>

            {tableMainDetail !== null && (
              <div className={styles.tableIssues_info}>
                <div className={styles.tableIssues_input_header}>
                  <label>Mã Bão Trì: {tableMainDetail?.tableMainCode}</label>
                  <p>
                    {tableMainDetail === null
                      ? ""
                      : formatDateTime(tableMainDetail.createdDate)}
                  </p>
                </div>

                <div className={styles.tableIssues_input_detail}>
                  <p>Tên bàn </p>
                  <h2>
                    <i className="bx bx-table"></i> {tableMainDetail.tableName}
                  </h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Nhân viên phụ trách </p>
                  <h2>
                    <i className="bx bx-user"></i> {tableMainDetail.staffName}
                  </h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Chi phí sửa chữa </p>
                  <h2>
                    <i className="bx bx-dollar-circle"></i>{" "}
                    {formatCurrency(tableMainDetail.estimatedCost)}
                  </h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Ngày bắt đầu </p>
                  <h2>
                    {tableMainDetail === null
                      ? ""
                      : formatDateTime(tableMainDetail.startDate)}
                  </h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Ngày kết thúc </p>
                  <h2>
                    {tableMainDetail === null
                      ? ""
                      : formatDateTime(tableMainDetail.endDate)}
                  </h2>
                </div>
                <div className={styles.tableIssues_input_detail}>
                  <p>Trạng thái </p>
                  <h2>{tableMainDetail.status}</h2>
                </div>
                <div className={styles.tableIssue_descript_info}>
                  <p>Mô tả</p>
                  <textarea
                    name=""
                    id="Description"
                    value={
                      tableMainDetail?.reason === null
                        ? ""
                        : tableMainDetail?.reason
                    }
                    rows={4}
                    cols={50}
                    readOnly
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isDialogProfileUpdate && (
        <div className={styles.profile_dialog1}>
          <div className={styles.profile_dialog_content1}>
            <div className={styles.wrap_head}>
              <h2>Thông tin bảo trì</h2>
              <button onClick={() => setIsDialogProfileUpdate(false)}>X</button>
            </div>
            <div className={styles.tableIssues_input_detail}>
              <p>Mật Khẩu Cũ </p>
              <h2>
                <input
                  type="password"
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu cũ..."
                />
              </h2>
            </div>

            <div className={styles.tableIssues_input_detail}>
              <p>Mật Khẩu Mới </p>
              <h2>
                <input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                />
              </h2>
            </div>

            <div className={styles.tableIssues_input_detail}>
              <p>Xác Nhận Mật Khẩu </p>
              <h2>
                <input
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập xác nhận mật khẩu..."
                />
              </h2>
            </div>

            <div className={styles.update_password_btn}>
              <button onClick={() => handleUpdatePassword()}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
