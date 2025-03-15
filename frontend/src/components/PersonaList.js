import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import PersonaLastModified from "./PersonaLastModified";
import "../styles/PersonaList.css";

const GET_PERSONAS = gql`
  query GetPersonas {
    personas {
      id
      name
      image
      quote
      lastModified
    }
  }
`;



const PersonaList = ({ onLogout }) => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PERSONAS);

  useEffect(() => {
    if (data) {
      console.log("Fetched personas:", data.personas);
    }
  }, [data]);

  if (loading) return <p>Loading personas...</p>;
  if (error) {
    console.error("GraphQL Error:", error);
    return <p>Error fetching personas.</p>;
  }

  return (
    <div className="persona-container">
      <div className="header">
        <h2 className="persona-title">Personas</h2>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
      <br />

      <div className="persona-grid">
        {data.personas.map((persona) => (
          <div
            key={persona.id}
            className="persona-card"
            onClick={() => navigate(`/edit/${persona.id}`)}
          >
            <img src={persona.image} alt={persona.name} className="persona-image" />
            <div className="persona-content">
              <h3 className="persona-name">{persona.name}</h3>
              <p className="persona-quote" dangerouslySetInnerHTML={{ __html: persona.quote }}></p>
              <p className="persona-updated">
                Last updated: <PersonaLastModified lastModified={persona.lastModified} />
              </p>
            </div>
          </div>
        ))}

        <div className="add-card" onClick={() => navigate("/create")}>
          <div className="add-icon">+</div>
          <p className="add-text">Add a Persona</p>
        </div>
      </div>
    </div>
  );
};

export default PersonaList;