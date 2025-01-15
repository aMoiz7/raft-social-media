"use client";

import { User, UserPlus2Icon, UserMinus2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { GET_POSTS_QUERY } from "@/app/actions/post"; // Adjust the path as necessary
import client from "@/app/auth/ApolloProviderWithAuth";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  followUser,
  unfollowUser,
  getFollowing,
} from "@/app/actions/follow-user";
import { useQuery } from "@apollo/client";

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string;
  user_id: string;
  username: string;
}

// Update to destructure refetchTrigger properly
const Card = ({ refetchTrigger }: { refetchTrigger: number }) => {
  const [following, setFollowing] = useState<string[]>([]);
  const { user } = useUser();

 

  const currentUserId = user?.sub || "";

  const { data, loading, error, refetch } = useQuery(GET_POSTS_QUERY, {
    fetchPolicy: "network-only", // Disable cache, always fetch fresh data
  });

  // Trigger the refetch whenever `refetchTrigger` changes
  useEffect(() => {
    if (refetch) {
      refetch(); // Refetch the posts when the refetchTrigger changes
    }
  }, [refetchTrigger, refetch]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const fetchedFollowing = await getFollowing(client, currentUserId);
        setFollowing(fetchedFollowing.map((user: any) => user.id)); // Only user IDs
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    fetchFollowing();
  }, [currentUserId]);

  const handleFollow = async (followedId: string) => {
    try {
      await followUser(client, currentUserId, followedId);
      setFollowing((prev) => [...prev, followedId]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (followedId: string) => {
    try {
      await unfollowUser(client, currentUserId, followedId);
      setFollowing((prev) => prev.filter((id) => id !== followedId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    console.error("Error fetching posts:", error);
    return <p>Error loading posts.</p>;
  }

  if (!data?.postsCollection?.edges.length) {
    return <p>No posts available.</p>;
  }

  const posts = data.postsCollection.edges.map((edge: any) => edge.node);

  return (
    <div className="h-screen overflow-x-auto no-scrollbar pb-10">
      {posts.map((post: Post) => (
        <div
          key={post.id}
          className="relative flex flex-col md:flex-row w-[70rem] my-6 pr-10 shadow-lg border-b border-slate-700 h-64 p-5"
        >
          <div className="relative p-2.5 md:w-2/5 shrink-0 overflow-hidden">
            <img
              src={post.image_url || "https://via.placeholder.com/150"}
              alt={post.title}
              className="h-full w-full rounded-md md:rounded-lg object-cover"
            />
          </div>
          <div className="p-6 h-fit w-full">
            <h4 className="mb-2 text-slate-300 text-xl font-semibold">
              {post.title}
            </h4>
            <p className="mb-4 text-slate-600 h-24 leading-normal font-light">
              {post.content}
            </p>
            <div className="flex items-end h-10 justify-between w-full">
              <div className="flex text-gray-400">
                <User /> <p>User Id : {post.user_id.slice(10,20)}</p>
              </div>
              {post.user_id !== currentUserId && currentUserId && (
                <div className="flex">
                  {following.includes(post.user_id) ? (
                    <Button
                      className="border-1 w-full mr-3 ml-3 text-white bg-red-600 border-gray-600 hover:bg-red-700"
                      onClick={() => handleUnfollow(post.user_id)}
                    >
                      <UserMinus2Icon /> Unfollow
                    </Button>
                  ) : (
                    <Button
                      className="border-1 w-full mr-3 ml-3 text-white bg-gray-700 border-gray-600 hover:bg-zinc-700"
                      onClick={() => handleFollow(post.user_id)}
                    >
                      <UserPlus2Icon /> Follow
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
