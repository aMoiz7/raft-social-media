import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
export type Client = ApolloClient<NormalizedCacheObject>;

export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface FollowerEdge {
  node: {
    follower_id: string;
  };
}

export interface FollowingEdge {
  node: {
    followed_id: string;
  };
}


export interface Auth0User extends User {
  sub: string; // Unique user identifier
  email?: string; // Email address
  email_verified?: boolean; // Email verification status
  name?: string; // Full name
  nickname?: string; // Nickname
  picture?: string; // Profile picture URL
  updated_at?: string; // Last update timestamp
  // Custom claims or metadata
  app_metadata?: {
    [key: string]: any;
  };
  user_metadata?: {
    [key: string]: any;
  };
  roles?: string[]; // Example: role-based access
  permissions?: string[]; // Example: permission-based access
}
