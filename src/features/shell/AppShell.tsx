"use client";

import Link from "next/link";
import styles from "@/features/shell/styles/appShell.module.css";
import { useT } from "@/shared/i18n/useT";

export function AppShell(props: {
  active: "conversations" | "settings";
  fillHeight?: boolean;
  children: React.ReactNode;
}) {
  const t = useT();

  return (
    <div className={styles.page}>
      <div className={styles.topNav}>
        <div className={styles.topNavInner}>
          <div className={styles.brand}>
            <h1 className={styles.appTitle}>{t("app.title")}</h1>
          </div>
          <nav className={styles.topNavLinks} aria-label="Primary">
            <Link
              className={props.active === "conversations" ? styles.navLinkActive : styles.navLink}
              href="/conversations"
            >
              {t("nav.conversations")}
            </Link>
            <Link className={props.active === "settings" ? styles.navLinkActive : styles.navLink} href="/settings">
              {t("nav.settings")}
            </Link>
          </nav>
        </div>
      </div>

      <div className={styles.content}>
        <div className={props.fillHeight ? `${styles.shell} ${styles.shellFill}` : styles.shell}>{props.children}</div>
      </div>
    </div>
  );
}

