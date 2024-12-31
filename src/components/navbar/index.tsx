import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar: React.FC = () => {
  
  const { user, error, isLoading } = useUser();
 
 

  return (
    <div className="flex flex-row h-12 rounded-sm border-1 shadow-lg bg-zinc-900 justify-between p-4 items-center">
      <div className="text-gray-300 text-xl ">Raft Social Media</div>
      <div className="flex gap-14">
        <div
          className="ml-auto 
       "
        >
          {!user ? (
            <Button className="btn btn-primary h-8 text-white bg-stone-700 border-1">
              <a href="/api/auth/login">Login</a>
            </Button>
          ) : (
            <Button
              className="btn btn-primary h-8 text-white bg-stone-700 border-1"
              variant="destructive"
            >
              <a href="/api/auth/logout">Logout</a>
            </Button>
          )}
        </div>
        <div className="text-gray-300 ml-auto mr-20 flex  items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {user?.name}
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
