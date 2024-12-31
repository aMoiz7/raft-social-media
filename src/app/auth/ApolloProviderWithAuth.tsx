import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://nqdcmxumehwesxzkgopu.supabase.co/graphql/v1",

    headers: {
      apikey:
        process.env.NEXT_PUBLIC_SUPABASE_KEY ||
        "",
      Authorization:
        process.env.NEXT_PUBLIC_SUPABASE_KEY ||
        "",
    },
  }),
  cache: new InMemoryCache(),
});

 
export default client;
