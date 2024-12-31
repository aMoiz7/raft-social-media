import { Client } from "@/lib/types";
import { gql } from "@apollo/client";

const GET_FOLLOWERS_AND_FOLLOWING_QUERY = gql`
  query GetFollowersAndFollowing($user_id: text!) {
    followers: followersCollection(filter: { followed_id: { eq: $user_id } }) {
      edges {
        node {
          follower_id
        }
      }
    }
    following: followersCollection(filter: { follower_id: { eq: $user_id } }) {
      edges {
        node {
          followed_id
        }
      }
    }
  }
`;

export const getFollowersAndFollowing = async (client:Client, user_id:string) => {
  try {
    const { data } = await client.query({
      query: GET_FOLLOWERS_AND_FOLLOWING_QUERY,
      variables: { user_id },
    });

    // Extract follower IDs
    const followerIds = data.followers.edges.map(
      (edge:any) => edge.node.follower_id
    );

    // Extract following IDs
    const followingIds = data.following.edges.map(
      (edge:any) => edge.node.followed_id
    );

    // Fetch user details for both followers and following
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

    // Fetch details for followers
    const { data: followerDetails } = await client.query({
      query: USER_DETAILS_QUERY,
      variables: { userIds: followerIds },
    });

    // Fetch details for following
    const { data: followingDetails } = await client.query({
      query: USER_DETAILS_QUERY,
      variables: { userIds: followingIds },
    });

    return {
      followers: followerDetails.usersCollection.edges.map((edge:any) => edge.node),
      following: followingDetails.usersCollection.edges.map(
        (edge:any) => edge.node
      ),
    };
  } catch (error) {
    console.error("Error fetching followers and following:", error);
    return { followers: [], following: [] };
  }
};
