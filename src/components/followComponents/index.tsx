"use client";

import { User2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import client from "@/app/auth/ApolloProviderWithAuth";
import { getFollowers, getFollowing } from "@/app/actions/follow-user";

interface User {
  id: string;
  username: string;
  avatar?: string; // Optional in case no avatar is provided
}

const FollowCompo = () => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

    const currentUserId = user?.sub || "";
    
   useEffect(() => {
     if (followers.length > 0) {
       localStorage.setItem("followers", JSON.stringify(followers));
     }
   }, [followers]);

   useEffect(() => {
     if (following.length > 0) {
       localStorage.setItem("following", JSON.stringify(following));
     }
   }, [following]);


  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        if (!currentUserId) return;

        // Fetch followers and following data
        const fetchedFollowers = await getFollowers(client, currentUserId);
        const fetchedFollowing = await getFollowing(client, currentUserId);

        setFollowers(fetchedFollowers);
        setFollowing(fetchedFollowing);
      } catch (error) {
        console.error("Error fetching follow data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowData();
  }, [currentUserId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Followers Section */}
      <div className="h-48 bg-zin mt-4 bg-zinc-800/30 text-zinc-600 z-20 shadow-lg m-1">
        <h1 className="border-b flex rounded-sm border-zinc-600 p-2 ">
          <User2 size={20} />
          Followers
        </h1>
        <ul className="text-sm p-1 overflow-y-auto max-h-36 flex flex-col gap-2 text-zinc-400">
          {followers.length > 0 ? (
            followers.map((follower) => (
              <li
                key={follower.id}
                className="flex items-center gap-3 bg-zinc-800 p-2 w-full rounded-sm font-semibold"
              >
               
                {follower.username}
              </li>
            ))
          ) : (
            <p className="text-center text-zinc-500">No followers yet</p>
          )}
        </ul>
      </div>

      {/* Following Section */}
      <div className="h-48 bg-zin mt-2 bg-zinc-800/30 text-zinc-600 z-20 shadow-lg m-1">
        <h1 className="border-b flex rounded-sm border-zinc-600 p-2 ">
          <User2 size={20} />
          Following
        </h1>
        <ul className="text-sm p-1 overflow-y-auto max-h-36 flex flex-col gap-2 text-zinc-400">
          {following.length > 0 ? (
            following.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-3 bg-zinc-800 p-2 w-full rounded-sm font-semibold"
              >
              
                {user.username}
              </li>
            ))
          ) : (
            <p className="text-center text-zinc-500">
              Not following anyone yet
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FollowCompo;
