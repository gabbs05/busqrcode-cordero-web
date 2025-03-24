"use client";
import { ScrollShadow } from "@heroui/react";
interface SideBarProps {
  children?: any;
}

export default function SideBar({ children }: SideBarProps) {
  return (
    <div className="w-72 bg-gray-800 relative overflow-y-auto sidebar">
      <div className="absolute inset-0">
        <div className="flex flex-col justify-center items-center mt-2">
          <p className="text-2xl text-slate-100 "></p>
        </div>

        {children}
      </div>
    </div>
  );
}
