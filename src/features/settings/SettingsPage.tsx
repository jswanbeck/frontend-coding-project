"use client";

import { AppShell } from "@/features/shell";
import styles from "@/features/settings/styles/settingsPage.module.css";
import { useT } from "@/shared/i18n/useT";
import { useSettings } from "@/features/settings/SettingsProvider";

export function SettingsPage() {
  const t = useT();
  const { locale, setLocale, chatMode, setChatMode } = useSettings();

  return (
    <AppShell active="settings">
      <div className={styles.landing}>
        <div className={styles.settingsContent}>
          <div className={styles.settingsHeader}>
            <p className={styles.shellTitle}>{t("settings.title")}</p>
          </div>

          <div className={styles.settingRow}>
            <label className={styles.settingLabel}>{t("settings.language")}</label>
            <select
              className={styles.settingSelect}
              value={locale}
              onChange={(e) => setLocale(e.target.value as "en" | "fr" | "debug")}
            >
              <option value="en">{t("settings.languageEn")}</option>
              <option value="fr">{t("settings.languageFr")}</option>
              <option value="debug">{t("settings.languageDebug")}</option>
            </select>
          </div>

          <div className={styles.settingRow}>
            <label className={styles.settingLabel}>{t("settings.apiMode")}</label>
            <select
              className={styles.settingSelect}
              value={chatMode}
              onChange={(e) => setChatMode(e.target.value as "mock" | "openai")}
            >
              <option value="mock">{t("settings.apiModeMock")}</option>
              <option value="openai">{t("settings.apiModeOpenAI")}</option>
            </select>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

