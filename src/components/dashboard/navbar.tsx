"use client";

// import { SidebarTrigger } from "../ui/sidebar";
import { Search, X, Settings, LogOut, User } from "lucide-react";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { postRequest } from "@/server/methods";
import { ENDPOINTS } from "@/server/endpoint";
import { useAuthStore } from "@/store/authStore";
import { useFileStore } from "@/store/fileStore";
import { useFolderStore } from "@/store/folderStore";
import { useEffect, useState, useCallback } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const { user, fetchUser, isLoading } = useAuthStore();
  const { searchQuery, setSearchQuery, searchFiles, fetchFiles } = useFileStore();
  const currentFolderId = useFolderStore(s => s.currentFolderId);

  // For debouncing input
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
      if (inputValue.trim() === "") {
        fetchFiles(currentFolderId);
      } else {
        searchFiles(inputValue);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [inputValue, setSearchQuery, searchFiles, fetchFiles, currentFolderId]);

  // Fallback initial if user is loading or name is missing
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 flex h-[64px] shrink-0 items-center justify-between px-4 bg-[#F9FAFD] dark:bg-sidebar">
      {/* <div className="flex items-center gap-2 pr-4 min-w-[150px]">
        <SidebarTrigger className="-ml-1 text-foreground/70" />
      </div> */}

      <div className="flex-1 max-w-[720px] w-full hidden md:flex items-center justify-center mx-4">
        <div className="flex items-center w-full bg-[#E9EEF6] dark:bg-[#282a2c] hover:bg-white dark:hover:bg-[#333333] hover:shadow-sm transition-all rounded-full h-[48px] px-1 focus-within:bg-white dark:focus-within:bg-[#333333] focus-within:shadow-md">
          <button className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0 text-[#1f1f1f] dark:text-[#c4c7c5] ml-1">
            <Search className="h-[22px] w-[22px] stroke-[1.5]" />
          </button>

          <input
            type="text"
            placeholder="Search in Drive"
            className="flex-1 bg-transparent border-none outline-none px-2 text-[16px] text-black dark:text-[#e3e3e3] placeholder:text-[#444746] dark:placeholder:text-[#c4c7c5]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          {inputValue && (
            <button
              onClick={() => setInputValue("")}
              className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0 text-[#1f1f1f] dark:text-[#c4c7c5] mr-1"
            >
              <X className="h-[20px] w-[20px] stroke-[1.5]" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 min-w-[150px] justify-end">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-[34px] w-[34px] shrink-0 ml-1 rounded-full overflow-hidden hover:ring-4 hover:ring-black/5 dark:hover:ring-white/10 transition-all cursor-pointer bg-emerald-700 flex items-center justify-center border-none outline-none">
              {!isLoading && user?.profile_image ? (
                <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[15px] font-medium leading-none">
                  {initial}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[360px] rounded-[24px] p-0 bg-[#e9eef6] dark:bg-[#282a2c] border-none shadow-[0px_4px_16px_rgba(0,0,0,0.1)] text-[#1f1f1f] dark:text-[#e3e3e3] mr-4 mt-2" align="end">

            <div className="flex flex-col items-center pt-4 px-6 pb-6 relative">
              {/* Top Bar for Email & Close */}
              <div className="flex w-full justify-between items-center mb-6">
                <div className="flex-1 text-center justify-center flex ml-6">
                  <p className="text-[14px] text-[#444746] dark:text-[#c4c7c5] font-medium">{user?.email}</p>
                </div>
                {/* Close Button placeholder - Shadcn auto-closes on outside click anyways, but matches UI */}
                <button className="h-8 w-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-[#444746] dark:text-[#c4c7c5]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>

              {/* Avatar Section */}
              <div className="relative mb-4">
                <div className="h-[84px] w-[84px] shrink-0 rounded-full overflow-hidden bg-emerald-700 flex items-center justify-center">
                  {!isLoading && user?.profile_image ? (
                    <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-[32px] font-medium leading-none">
                      {initial}
                    </span>
                  )}
                </div>
                {/* Camera icon badge */}
                <button className="absolute bottom-0 right-0 h-7 w-7 bg-white dark:bg-[#333333] rounded-full flex items-center justify-center shadow-sm border border-black/5 dark:border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#444746] dark:text-[#c4c7c5]"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                </button>
              </div>

              {/* Greeting */}
              <h2 className="text-[22px] font-normal text-[#1f1f1f] dark:text-[#e3e3e3] mb-6">Hi, {user?.name?.split(' ')[0] || "User"}!</h2>
            </div>

            {/* Bottom Actions Area */}
            <div className="bg-[#ffffff] border-2 dark:bg-[#1a1b1e] rounded-b-[24px] rounded-t-[16px] p-2">
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await postRequest(ENDPOINTS.auth.logout);
                  } catch (e) {
                    console.error("Failed to cleanly logout from backend:", e);
                  }
                  Cookies.remove("token");
                  window.location.href = "/auth";
                }}
                className="h-[52px] px-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/5 dark:focus:bg-white/5 rounded-t-sm rounded-b-[20px] text-[#1f1f1f] dark:text-[#e3e3e3] flex items-center"
              >
                <LogOut className="mr-4 h-[20px] w-[20px] text-[#444746] dark:text-[#c4c7c5]" />
                <span className="text-[14px] font-medium">Sign out of all accounts</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header >
  );
}