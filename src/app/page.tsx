"use client"
import Card from "@/components/feedsCard";
import Sidebar from "@/components/sideMenu";
import Image from "next/image";
import { useState } from "react";


export default function Home() {
  const [refetchTrigger, setRefetchTrigger] =useState(0);

  const triggerRefetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex w-full justify-between  h-screen no-scrollbar">
        {/* <AuthButtons /> */}
        <Sidebar triggerRefetch={triggerRefetch} />
        <Card refetchTrigger={refetchTrigger} />
      </div>
    </>
  );
}
