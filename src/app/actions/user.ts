import { gql, useQuery, useMutation } from "@apollo/client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

// GraphQL Query to Check if User Exists
const CHECK_USER = gql`
  query CheckUser($id: String!) {
    usersCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

// GraphQL Mutation to Add a User
const ADD_USER = gql`
  mutation AddUser(
    $id: String!
    $username: String!
    $email: String!
    $avatar: String
  ) {
    insertIntousersCollection(
      objects: [
        { id: $id, username: $username, email: $email, avatar: $avatar }
      ]
    ) {
      records {
        id
        username
        email
        avatar
      }
    }
  }
`;

export default function SaveUserAutomatically() {
  const { user, isLoading } = useUser(); // Auth0 user object
  const [addUser] = useMutation(ADD_USER);
  const { data, loading: checkingUser } = useQuery(CHECK_USER, {
    variables: { id: user ? user.sub : null },
    skip: !user, // Skip query if user is not loaded yet
  });

  useEffect(() => {
    const saveUserToDatabase = async () => {
      if (isLoading || checkingUser || !user) return;

      try {
        const userId = user.sub; // Use Auth0 user ID directly
        const existingUser = data?.usersCollection?.edges?.[0]?.node;

        if (!existingUser) {
          await addUser({
            variables: {
              id: userId, // Use the Auth0 user ID
              username: user.name,
              email: user.email,
              avatar: user.picture,
            },
          });
          console.log("User added to the database!");
        } else {
          console.log("User already exists in the database.");
        }
      } catch (err) {
        console.error("Error saving user:", err);
      }
    };

    saveUserToDatabase();
  }, [user, isLoading, checkingUser, data, addUser]);

  return null; // No UI needed
}
