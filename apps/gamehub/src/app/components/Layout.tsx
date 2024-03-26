import React from 'react';
import { Outlet } from 'react-router';
import styles from './layout.module.css';
import { Navbar } from '@bb/auth-hook-lib';

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles['navbar-padding']} />
      <div className={styles['page-content']}>
        <Outlet />
      </div>
    </div>
  );
}
