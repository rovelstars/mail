"use client";

import type { Email } from "@/App";
import { Checkbox } from "@/components/ui/checkbox";
import { Disc3, MailCheck, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DecryptedText from "./ui/DecryptedText";
import { aesGcmDecrypt } from "@/lib/L4_classical";
export function EmailList({
  emails,
  loadingStatus,
  setMailRead,
  userData,
}: {
  emails: Email[];
  loadingStatus: boolean;
  setMailRead: (id: string, read: boolean) => void;
  userData: { email: string; name?: string; aesKey?: string } | null;
}) {
  if (!emails?.length) {
    return (
      <div className="h-full grid place-items-center p-6">
        <div className="text-sm text-muted-foreground">
          {loadingStatus ? (
            <div className="flex items-center gap-2">
              <Disc3 className="animate-spin" />
              Loading emails...
            </div>
          ) : (
            <div>No emails to display.</div>
          )}
        </div>
      </div>
    );
  }
  function parseL4Body(m: Email) {
    const body = JSON.parse((m as any).body);
    console.log(body);
    if (!userData) return "(no content)";
    const ct = Buffer.from(body.ct, "base64");
    const key = userData?.aesKey;
    const iv = Buffer.from(body.iv, "base64");
    const tag = Buffer.from(body.tag, "base64");
    return aesGcmDecrypt(ct, key, iv, tag).toString("utf-8");
  }
  return (
    <ul className="p-4 grid gap-3">
      {emails.map((m) => (
        <li
          key={m.id}
          onClick={() => {
            setMailRead(m.id, !(m as any).read);
          }}
        >
          <div className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/60">
            <Checkbox />

            <div className="w-10 h-10 flex items-center justify-center bg-indigo-200 dark:bg-indigo-700 rounded-full text-sm font-medium">
              {(m as any).from?.charAt(0)?.toUpperCase() ?? "?"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        (m as any).unread
                          ? "truncate font-semibold"
                          : "truncate text-muted-foreground"
                      }
                    >
                      {(m as any).category == "outbox" ? "To: " : ""}
                      {(m as any).from ?? (m as any).sender ?? "Unknown"}
                    </span>
                    <span
                      className={`text-md truncate ${(m as any).unread ? "text-pretty font-extrabold" : "text-muted-foreground"}`}
                    >
                      {" — "}
                      {(m as any).subject ?? "(no subject)"}
                    </span>
                    <span
                      className={`text-xs border-2 ${(m as any).encryption <= 4 ? "bg-green-500/50 border-green-500/90" : "bg-red-500/50 border-red-500/90"} px-2 py-0.5 rounded-full`}
                    >
                      {(m as any).encryption > 4 ? (
                        <MailWarning className="w-4 h-4 inline-block align-middle mr-1" />
                      ) : (
                        <MailCheck className="w-4 h-4 inline-block align-middle mr-1" />
                      )}
                      {(m as any).encryption === 1
                        ? "Quantum Secure"
                        : (m as any).encryption === 2
                          ? "Quantum-aided AES"
                          : (m as any).encryption === 3
                            ? "Post-Quantum Cryptography"
                            : (m as any).encryption === 4
                              ? "Classical Encryption"
                              : (m as any).encryption === 5
                                ? "No Encryption"
                                : "Unknown Encryption"}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {(m as any).date
                    ? new Date((m as any).date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>

              <div className="text-sm text-muted-foreground truncate mt-1 flex items-center gap-2">
                <span className="truncate">
                  {((m as any).snippet ??
                  (m as any).preview ??
                  (m as any).encryption == 5) ? (
                    String((m as any).body).slice(0, 120)
                  ) : (
                    <DecryptedText
                      text="ENCRYPTED"
                      animateOn="view"
                      sequential={true}
                      revealDirection="start"
                      speed={60}
                      maxIterations={50}
                    />
                  )}
                </span>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="default"
                      size="icon"
                      className="ml-auto w-24"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      View
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full max-w-3xl">
                    <SheetHeader>
                      <SheetTitle className="text-lg">
                        {(m as any).subject ?? "(no subject)"}
                      </SheetTitle>
                      <SheetDescription className="text-sm text-muted-foreground">
                        From:{" "}
                        {(m as any).from ?? (m as any).sender ?? "Unknown"}
                        <br />
                        To: {(m as any).to?.join(", ") ?? "Unknown"}
                        <br />
                        Date:{" "}
                        {(m as any).date
                          ? new Date((m as any).date).toLocaleString()
                          : "Unknown"}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="m-4 whitespace-pre-wrap bg-secondary p-4 rounded-md min-h-48">
                      {(m as any).encryption > 4 ? (
                        ((m as any).body ?? "(no content)")
                      ) : (
                        <DecryptedText
                          sequential={true}
                          animateOn="view"
                          revealDirection="start"
                          speed={60}
                          maxIterations={50}
                          text={parseL4Body(m) || "(no content)"}
                        />
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
