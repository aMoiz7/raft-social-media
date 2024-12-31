import { Auth0User, Client } from "@/lib/types";
import { gql } from "@apollo/client";
import { v5 as uuidv5 } from "uuid";

// Replace this with a fixed namespace UUID
const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $user_id: uuid!
    $title: String!
    $content: String!
    $image_url: String
  ) {
    insertIntopostsCollection(
      objects: [
        {
          user_id: $user_id
          title: $title
          content: $content
          image_url: $image_url
        }
      ]
    ) {
      records {
        id
        title
        content
        image_url
        user_id
      }
    }
  }
`;

export async function createPost(client :Client, user:Auth0User, title:string, content:string, imageUrl:string) {
  const userId = uuidv5(user.sub, NAMESPACE);

  try {
    const { data } = await client.mutate({
      mutation: CREATE_POST_MUTATION,
      variables: {
        user_id: userId,
        title,
        content,
        image_url: imageUrl,
      },
    });

    console.log("Post created successfully:", data);
    return data;
  } catch (error:any) {
    console.error("Error creating post:", error.message || error);
    throw error;
  }
}

export { CREATE_POST_MUTATION };





// Define the query to fetch posts
const GET_POSTS_QUERY = gql`
  query GetPosts {
    postsCollection {
      edges {
        node {
          id
          title
          content
          image_url
          user_id
        }
      }
    }
  }
`;

const GET_USERS_QUERY = gql`
  query GetUsers($ids: [uuid!]!) {
    usersCollection(filter: { id: { in: $ids } }) {
      edges {
        node {
          id
          username
        }
      }
    }
  }
`;


// Function to fetch posts
export async function getPostsWithUsers(client:any) {
  try {
    // Fetch posts
    const { data: postsData } = await client.query({ query: GET_POSTS_QUERY });
    const posts = postsData.postsCollection.edges.map((edge:any) => edge.node);

    // Extract unique user IDs
    const userIds = [...new Set(posts.map((post:any) => post.user_id))];

    // Fetch user details
    const { data: usersData } = await client.query({
      query: GET_USERS_QUERY,
      variables: { ids: userIds },
    });

    const users = Object.fromEntries(
      usersData.usersCollection.edges.map(({ node }:any) => [
        node.id,
        node.username,
      ])
    );

    // Combine posts with user details
    const postsWithUsers = posts.map((post:any) => ({
      ...post,
      username: users[post.user_id] || "Unknown User",
    }));

    return postsWithUsers;
  } catch (error:any) {
    console.error("Error fetching posts with users:", error.message || error);
    throw error;
  }
}


export { GET_POSTS_QUERY, GET_USERS_QUERY };
