import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import PersonaList from "./components/PersonaList";
import { CreatePersona, EditPersona } from "./components/PersonaForm";

// Create GraphQL API Link
const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
});

// Create Authorization Header
const createAuthLink = (token) =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));

const App = () => {
  const [authToken, setAuthToken] = useState(null); // Store token in React state

  const client = new ApolloClient({
    link: createAuthLink(authToken).concat(httpLink),
    cache: new InMemoryCache(),
  });

  // Reusable Protected Route Component
  const ProtectedRoute = ({ element }) => {
    return authToken ? element : <Navigate to="/login" />;
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/persona" element={<ProtectedRoute element={<PersonaList />} />} />
          <Route path="/create" element={<ProtectedRoute element={<CreatePersona />} />} />
          <Route path="/edit/:id" element={<ProtectedRoute element={<EditPersona />} />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
