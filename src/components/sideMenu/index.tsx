"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_POST_MUTATION } from "@/app/actions/post";
import supabase from "@/hooks/supabase";
import FollowCompo from "../followComponents";

// Import react-select
import Select from "react-select";
import { CustomStyles } from "@/lib/utils";
import { toast } from "sonner";

interface SidebarProps {
  triggerRefetch: () => void; // Ensuring this is a function
}

const Sidebar = ({ triggerRefetch }: SidebarProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  const [createPost] = useMutation(CREATE_POST_MUTATION);

  // Handle image file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // Handle content updates
  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(event.target.value);
  };

  // Open the post creation sheet
  const postHandler = () => {
    if (user) {
      setIsSheetOpen(true);
    } else {
      router.push("/api/auth/login");
    }
  };

  // Upload image to Supabase
  const uploadImage = async (file: File) => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images") // Replace with your bucket name
        .upload(fileName, file);

      if (uploadError) {
        console.error("Error uploading image:", uploadError.message);
        return null;
      }

      console.log("Image uploaded successfully:", uploadData);

      // Generate the public URL
      // @ts-expect-error: This is a temporary workaround for TypeScript error
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      if (publicUrlError) {
        console.error("Error generating public URL:", publicUrlError.message);
        return null;
      }

      console.log("Generated public URL:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl; // Correctly return the URL
    } catch (err) {
      console.error("Error during image upload:", err);
      return null;
    }
  };

  // Submit the post
  const handleSubmit = async () => {
    if (!postContent.trim() || !postTitle.trim()) {
      alert("Post title and content cannot be empty!");
      return;
    }

    let imageUrl = null;
    if (selectedFile) {
      imageUrl = await uploadImage(selectedFile);
      console.log(imageUrl);
    }

    try {
      const { data } = await createPost({
        variables: {
          user_id: user?.sub, // Pass Auth0 user ID
          title: postTitle,
          content: postContent,
          image_url: imageUrl,
        },
      });

      console.log("Post created:", data);
      setPostTitle("");
      setPostContent("");
      setSelectedFile(null);
      setIsSheetOpen(false);

      // alert("Post created successfully!");
      triggerRefetch();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Get followers and following from localStorage
  useEffect(() => {
    const storedFollowers = JSON.parse(
      localStorage.getItem("followers") || "[]"
    );
    const storedFollowing = JSON.parse(
      localStorage.getItem("following") || "[]"
    );
    setFollowers(storedFollowers || []); // Ensure it's an array
    setFollowing(storedFollowing || []); // Ensure it's an array
  }, []);

  // Check if we have followers or following to display mentions
  const mentionData = [
    ...(Array.isArray(followers) && followers.length > 0
      ? followers.map((f: any) => ({ value: f.id, label: `@${f.username}` }))
      : []),
    ...(Array.isArray(following) && following.length > 0
      ? following.map((f: any) => ({ value: f.id, label: `@${f.username}` }))
      : []),
  ];

  return (
    <div className="bg-zinc-900 text-gray-400 w-52 flex flex-col">
      {/* User Profile Section */}
      <div className="flex flex-col items-center bg-zinc-800/30 w-full p-4">
        <Avatar className="h-20 w-20 mt-5 flex justify-center items-center">
          <AvatarImage
            src={user?.picture || "https://github.com/shadcn.png"}
            alt={user?.name || "User"}
          />
          <AvatarFallback>
            {user?.name?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <h1 className="mt-5 font-semibold font-mono text-sm">
          {user?.name || "Guest"}
        </h1>
      </div>

      {/* Create New Post Button */}
      <div className="flex justify-center items-center w-full">
        <Button
          className="border-1 w-full mr-3 ml-3 text-white bg-stone-700 mt-5 border-gray-600 hover:bg-zinc-700"
          variant="secondary"
          onClick={postHandler}
        >
          Create New Post
        </Button>
      </div>

      {/* Create Post Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="bg-zinc-900 text-gray-300">
          <SheetHeader>
            <SheetTitle className="text-gray-400 font-sans">
              Create New Post
            </SheetTitle>
            <SheetDescription>
              Share your thoughts with your followers.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {/* Title Input */}
            <div className="items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Textarea
                id="title"
                placeholder="Post Title"
                className="col-span-3"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>

            {/* Post Content */}
            <div className="items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="What's on your mind?"
                className="col-span-3 h-28"
                value={postContent}
                onChange={handlePostChange}
              />
              {/* Mentions input */}
              <Select
                styles={CustomStyles}
                options={mentionData}
                onChange={(selectedOption) => {
                  setPostContent(postContent + " " + selectedOption?.label); // Add mention to the content
                }}
                isClearable
                placeholder="Add a mention"
                className="bg-zinc-600  text-gray-300"
              />
            </div>

            <div className="items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="col-span-3 text-gray-300 bg-zinc-600"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                className="bg-blue-800 w-32 text-white"
                onClick={handleSubmit}
              >
                Post
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <FollowCompo />
    </div>
  );
};

export default Sidebar;
