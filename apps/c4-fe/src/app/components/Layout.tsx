import React from 'react';
import styles from './layout.module.css';
import { Navbar } from '@bb/auth-hook-lib';
import { Outlet } from 'react-router';

interface Props {}

export default function Layout({}: Props) {
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
