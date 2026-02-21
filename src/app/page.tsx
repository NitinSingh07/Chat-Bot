"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useSyncUser } from "@/hooks/useSyncUser";
import { ConversationList } from "@/components/chat/ConversationList";
import { UserSearch } from "@/components/chat/UserSearch";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { PresenceHandler } from "@/components/PresenceHandler";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus } from "lucide-react";
import { CreateGroupDialog } from "@/components/chat/CreateGroupDialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  useSyncUser();
  const [selectedConversationId, setSelectedConversationId] = useState<any>(null);
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      let newWidth = e.clientX;
      if (newWidth < 300) newWidth = 300;
      if (newWidth > 500) newWidth = 500;
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return (
    <main className="flex h-full bg-[#0a1014] overflow-hidden relative">
      <PresenceHandler />

      {/* Sidebar */}
      <div
        style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
        className={cn(
          "w-full md:w-[var(--sidebar-width)] border-r border-white/10 flex flex-col shrink-0 bg-[#111b21] relative transition-none",
          selectedConversationId ? "hidden md:flex" : "flex"
        )}
      >
        <div
          className="absolute top-0 right-[-3px] w-[6px] h-full cursor-col-resize z-50 hover:bg-white/10 active:bg-white/20 transition-colors hidden md:block"
          onMouseDown={() => setIsDragging(true)}
        />
        {/* Sidebar Header */}
        <div className="px-4 h-[60px] border-b border-[#202c33] flex items-center justify-between shrink-0 bg-[#202c33]">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <h1 className="text-xl font-bold tracking-tight text-white/90 font-sans">TARS Chat</h1>
          </div>
        </div>

        {/* Search + Conversations */}
        <SignedIn>
          <div className="flex-1 flex flex-col min-h-0 relative">
            <UserSearch onSelect={(id) => setSelectedConversationId(id)} />
            <div className="flex-1 overflow-hidden">
              <ConversationList
                selectedId={selectedConversationId}
                onSelect={(id) => setSelectedConversationId(id)}
              />
            </div>

            {/* Create Group Floating Button */}
            <div className="absolute bottom-6 right-6 z-30">
              <CreateGroupDialog onSelect={(id) => setSelectedConversationId(id)}>
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-xl bg-[#00a884] shadow-lg hover:shadow-xl hover:bg-[#06cf9c] hover:scale-105 active:scale-95 transition-all duration-300 group"
                >
                  <MessageSquare className="h-6 w-6 text-white transition-transform duration-300" fill="currentColor" />
                </Button>
              </CreateGroupDialog>
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Welcome to TARS Chat</p>
              <p className="text-xs text-muted-foreground mt-1">Sign in to start messaging</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <SignInButton mode="modal">
                <button className="w-full text-sm font-medium border border-border rounded-xl py-2 hover:bg-accent transition-colors">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full text-sm font-medium bg-primary text-primary-foreground rounded-xl py-2 hover:opacity-90 transition-opacity">Sign Up</button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>
      </div>

      {/* Main Chat Area */}
      <div
        className={cn(
          "flex-1 min-w-0 transition-all",
          !selectedConversationId ? "hidden md:flex" : "flex"
        )}
      >
        {selectedConversationId ? (
          <ChatWindow
            conversationId={selectedConversationId}
            onBack={() => setSelectedConversationId(null)}
          />
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center flex-col gap-4 p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Select a conversation</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Search for a user above or pick an existing conversation to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
