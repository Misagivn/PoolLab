import React, { useState } from 'react';
import { User, Settings, HelpCircle, Moon, MessageSquare, LogOut } from 'lucide-react';
import styles from './layout.module.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Xử lý đăng xuất
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className={styles.profile_container}>
      <button 
        className={styles.profile_button}
        onClick={() => setIsOpen(!isOpen)}
      >
        Profile
      </button>
      
      {isOpen && (
        <div className={styles.dropdown_menu}>
          <div className={styles.user_info}>
            <div className={styles.avatar}>
              <User size={32} />
            </div>
            <span className={styles.username}>
              {sessionStorage.getItem('username') || 'User'}
            </span>
          </div>
          
          <div className={styles.dropdown_divider} />
          
          <button className={styles.dropdown_item}>
            <User size={20} />
            <span>trang cá nhân</span>
          </button>
          
          <button className={styles.dropdown_item}>
            <Settings size={20} />
            <span>Thông tin đặt bàn</span>
          </button>
          
          <button className={styles.dropdown_item}>
            <MessageSquare size={20} />
            <span>Đóng góp ý kiến</span>
          </button>
          
          <div className={styles.dropdown_divider} />
          
          <button 
            className={styles.dropdown_item}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;