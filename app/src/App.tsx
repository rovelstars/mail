"use client";

import { use, useEffect, useMemo, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { Sidebar } from "@/components/sidebar";
import { EmailList } from "@/components/email-list";
import { AuthForm } from "@/components/auth-form";
import { ComposeEmail } from "@/components/compose-email";
import { SettingsDialog } from "@/components/settings-dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Cookie from "js-cookie";
import { Skeleton } from "@/components/ui/skeleton";
import { aesGcmEncrypt } from "./lib/L4_classical";

export type EmailCategory = "primary" | "spam" | "outbox"; //outbox doesnt exist on server, just for client state.
export type Email = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: string; // ISO
  category: EmailCategory;
  encryption: number; // 1-5, see docs
  readBy?: string[]; // emails of users who have read this email
};

type User = {
  email: string;
  password: string;
  name?: string;
};

const EMAILS_KEY = "emails";
const USER_KEY = "user";
const SESSION_KEY = "session";
const ENDPOINT = `${import.meta.env.VITE_API_BASE_URL || ""}/api/v1`;

export default function Page() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<EmailCategory>("primary");

  // Load session
  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
  } = useSWR(`${ENDPOINT}`, async () => {
    const res = await fetch(`${ENDPOINT}/accounts/whoami`, {
      headers: {
        Authorization: `Bearer ${Cookie.get("token") || ""}`,
      },
    });
    if (!res.ok) {
      const error: any = new Error("Failed to fetch user data");
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return await res.json();
  });

  useEffect(() => {
    console.log("userData update:", userData, userDataError, userDataLoading);
    if (userData && userData.email) {
      setSessionEmail(userData.email);
      setSessionName(userData.name || null);
    } else {
      setSessionEmail(null);
    }
  }, [userDataLoading]);

  const {
    data: mails,
    error: mailsError,
    isLoading: mailsLoading,
  } = useSWR(
    sessionEmail
      ? `${ENDPOINT}/mails/${activeCategory == "outbox" ? "outbox" : "inbox"}`
      : null,
    async () => {
      const res = await fetch(
        `${ENDPOINT}/mails/${activeCategory == "outbox" ? "outbox" : "inbox"}`,
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("token") || ""}`,
          },
        },
      );
      if (!res.ok) {
        const error: any = new Error("Failed to fetch emails");
        error.info = await res.json();
        error.status = res.status;
        throw error;
      }
      return res.json();
    },
  );

  useEffect(() => {
    console.log("mails update:", mails, mailsError, mailsLoading);
    if (mails && mails.emails) {
    }
  }, [mailsLoading]);

  const filteredEmails = useMemo(
    () =>
      mailsLoading
        ? []
        : mails?.emails
            ?.filter?.((e: Email) => e.category === activeCategory)
            .map((e: Email) => ({
              unread: !e.readBy?.includes(sessionEmail || ""),
              read: e.readBy?.includes(sessionEmail || ""),
              ...e,
            })),
    [mails, mailsLoading, activeCategory],
  );

  const handleAuthSuccess = (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(SESSION_KEY, user.email);
    setSessionEmail(user.email);
    toast("Signed in", { description: "Welcome back!" });
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionEmail(null);
  };

  const handleSendEmail = async (draft: {
    to: string;
    subject: string;
    body: string;
  }) => {
    if (!sessionEmail) return;
    console.log(userData.preferEncryption);
    let enBody: any;
    let pEn = userData.preferEncryption;
    console.log("email sending from", userData.aesKey);
    if (pEn == 4) {
      enBody = aesGcmEncrypt(draft.body, userData.aesKey);
      console.log("Encrypted body:", enBody);
    }
    const newEmail: Email = {
      // empty values are filled by server. kept here for type safety
      id: "",
      from: "",
      to: [draft.to], //here draft.to is string.
      subject: draft.subject,
      body: pEn == 5 ? draft.body : enBody,
      encryption: pEn,
      date: "",
      // For demo, also lands in your primary so you can "receive" it
      category: "primary",
    };
    const res = await fetch(`${ENDPOINT}/mails/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookie.get("token") || ""}`,
      },
      body: JSON.stringify(newEmail),
    });
    if (!res.ok) {
      const errorRes = await res.json();
      toast("Error", { description: errorRes.error || "Failed to send email" });
      return;
    }
    const resData = await res.json();
    newEmail.id = resData.email.id;
    newEmail.date = resData.email.date;
    newEmail.from = resData.email.from;
    newEmail.body = JSON.stringify(newEmail.body); //ensures body is string for outbox
    console.log("Email sent:", resData.email);
    // Update local storage and SWR cache
    // New emails appear at the top

    const next = [newEmail, ...mails.emails];
    globalMutate(`${ENDPOINT}/mails/inbox`, { emails: next }, false);
    toast("Email sent", { description: `Sent to ${draft.to}` });
  };

  const setMailRead = async (mailId: string, read: boolean) => {
    if (!sessionEmail) return;
    try {
      const res = await fetch(`${ENDPOINT}/mails/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookie.get("token") || ""}`,
        },
        body: JSON.stringify({ mailId, read }),
      });
      if (!res.ok) {
        const errorRes = await res.json();
        toast("Error", {
          description: errorRes.error || "Failed to mark email as read",
        });
        return;
      }
      console.log(`Mail ${mailId} marked as ${read ? "read" : "unread"}`);
      // Update local SWR cache
      globalMutate(
        `${ENDPOINT}/mails/inbox`,
        async (currentData: any) => {
          if (!currentData || !currentData.emails) return currentData;
          const updatedEmails = currentData.emails.map((email: Email) => {
            if (email.id === mailId) {
              let newReadBy = email.readBy || [];
              if (read && !newReadBy.includes(sessionEmail)) {
                newReadBy = [...newReadBy, sessionEmail];
              } else if (!read && newReadBy.includes(sessionEmail)) {
                newReadBy = newReadBy.filter((e) => e !== sessionEmail);
              }
              return { ...email, readBy: newReadBy };
            }
            return email;
          });
          return { emails: updatedEmails };
        },
        false,
      );
    } catch (err) {
      toast("Network error", {
        description: "Could not connect to server.",
      });
    }
  };

  if (userDataError) {
    console.log("No session email found");
    return (
      <main className="min-h-dvh grid place-items-center">
        <div className="w-full max-w-md">
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex">
      {mailsLoading || !mails ? (
        <div className="w-64 border-r border-border p-4">
          <Skeleton className="w-full h-8 mb-4" />
          <Skeleton className="w-3/4 h-6 mb-2" />
          <Skeleton className="w-1/2 h-6 mb-2" />
        </div>
      ) : (
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenSettings={() => setSettingsOpen(true)}
          onLogout={handleLogout}
          primaryCount={
            mails.emails.filter((e: Email) => e.category === "primary").length
          }
          spamCount={
            mails.emails.filter((e: Email) => e.category === "spam").length
          }
          outboxCount={
            mails.emails.filter((e: Email) => e.category === "outbox").length
          }
        />
      )}
      <section className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border flex items-center justify-between px-4">
          <h1 className="text-lg font-medium text-pretty">
            {activeCategory === "outbox"
              ? "Outbox"
              : activeCategory === "primary"
                ? "Inbox — Primary"
                : activeCategory === "spam"
                  ? "Inbox — Spam"
                  : //@ts-ignore
                    `Inbox — ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
          </h1>
          <div className="text-sm text-muted-foreground">
            Signed in as{" "}
            {userDataLoading ? (
              <Skeleton className="w-12 h-4 inline-block align-middle" />
            ) : (
              sessionName
            )}
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <EmailList
            emails={filteredEmails}
            loadingStatus={mailsLoading}
            setMailRead={setMailRead}
            userData={userData}
          />
        </div>
      </section>

      <ComposeEmail onSend={handleSendEmail} />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        userData={{
          email: sessionEmail || "",
          name: sessionName || "",
          password: "",
        }}
        onSaved={() => {
          toast("Account updated", {
            description: "Your settings have been saved.",
          });
        }}
      />
      <Toaster />
    </main>
  );
}
