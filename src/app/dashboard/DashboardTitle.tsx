"use client";

import styles from "./DashboardTitle.module.scss";

export default function DashboardTitle({ userPK }: { userPK: string }) {
  return <h1 className={styles.title}>Dashboard</h1>;
}
