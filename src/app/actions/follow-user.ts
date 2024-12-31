import { Client } from "@/lib/types";
import { gql } from "@apollo/client";

// Mutation to follow a user
const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($follower_id: text!, $followed_id: text!) {
    insertIntofollowersCollection(
      objects: [{ follower_id: $follower_id, followed_id: $followed_id }]
    ) 
  }
`;

export const followUser = async (
  client: Client,
  follower_id: string,
  followed_id: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: FOLLOW_USER_MUTATION,
      variables: { follower_id, followed_id },
    });
    console.log("User followed successfully:", data);
  } catch (error) {
    console.error("Error following user:", error);
  }
};

// Mutation to unfollow a user
const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($follower_id: text!, $followed_id: text!) {
    deleteFromfollowersCollection(
      filter: {
        follower_id: { eq: $follower_id }
        followed_id: { eq: $followed_id }
      }
    ) 
  }
`;

export const unfollowUser = async (client:Client, follower_id:string, followed_id:string) => {
  try {
    const { data } = await client.mutate({
      mutation: UNFOLLOW_USER_MUTATION,
      variables: { follower_id, followed_id },
    });
    console.log("User unfollowed successfully:", data);
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
};

// Query to get following list
const GET_FOLLOWING_QUERY = gql`
  query GetFollowing($follower_id: text!) {
    followersCollection(filter: { follower_id: { eq: $follower_id } }) {
      edges {
        node {
          followed_id
        }
      }
    }
  }
`;

export const getFollowing = async (client:Client, follower_id:string) => {
  try {
    const { data } = await client.query({
      query: GET_FOLLOWING_QUERY,
      variables: { follower_id },
    });

    // Extract the followed IDs
    const followedIds = data.followersCollection.edges.map(
      (edge:any) => edge.node.followed_id
    );

    if (!followedIds.length) return [];

    // Fetch user details for the followed IDs
    const USER_DETAILS_QUERY = gql`
      query GetUserDetails($userIds: [text!]) {
        usersCollection(filter: { id: { in: $userIds } }) {
          edges {
            node {
              id
              username
              avatar
            }
          }
        }
      }
    `;
    const { data: userDetails } = await client.query({
      query: USER_DETAILS_QUERY,
      variables: { userIds: followedIds },
    });

    return userDetails.usersCollection.edges.map((edge:any) => edge.node);
  } catch (error) {
    console.error("Error fetching following:", error);
    return [];
  }
};

// Query to get followers list
const GET_FOLLOWERS_QUERY = gql`
  query GetFollowers($followed_id: text!) {
    followersCollection(filter: { followed_id: { eq: $followed_id } }) {
      edges {
        node {
          follower_id
        }
      }
    }
  }
`;

export const getFollowers = async (client:Client, followed_id:string) => {
  try {
    const { data } = await client.query({
      query: GET_FOLLOWERS_QUERY,
      variables: { followed_id },
    });

    // Extract the follower IDs
    const followerIds = data.followersCollection.edges.map(
      (edge:any) => edge.node.follower_id
    );

    if (!followerIds.length) return [];

    // Fetch user details for the follower IDs
    const USER_DETAILS_QUERY = gql`
      query GetUserDetails($userIds: [text!]) {
        usersCollection(filter: { id: { in: $userIds } }) {
          edges {
            node {
              id
              username
              avatar
            }
          }
        }
      }
    `;
    const { data: userDetails } = await client.query({
      query: USER_DETAILS_QUERY,
      variables: { userIds: followerIds },
    });

    return userDetails.usersCollection.edges.map((edge:any) => edge.node);
  } catch (error) {
    console.error("Error fetching followers:", error);
    return [];
  }
};
