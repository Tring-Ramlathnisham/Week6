import React, { useState, useEffect } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/PersonaForm.css";

const defaultImage = "defaultimage.jpg";

// GraphQL Queries & Mutations
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

const GET_PERSONA = gql`
  query GetPersona($id: ID!) {
    persona(id: $id) {
      id
      name
      image
      quote
      description
      attitudes
      painPoints
      jobs
      activities
    }
  }
`;

const CREATE_PERSONA = gql`
  mutation CreatePersona($input: PersonaInput!) {
    createPersona(input: $input) {
      id
    }
  }
`;

const UPDATE_PERSONA = gql`
  mutation UpdatePersona($id: ID!, $input: PersonaInput!) {
    updatePersona(id: $id, input: $input) {
      id
    }
  }
`;

const DELETE_PERSONA = gql`
  mutation DeletePersona($id: ID!) {
    deletePersona(id: $id)
  }
`;

const PersonaForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useQuery(GET_PERSONA, { variables: { id }, skip: !isEdit });

  const [persona, setPersona] = useState({
    name: "",
    image: defaultImage,
    quote: "",
    description: "",
    attitudes: "",
    painPoints: "",
    jobs: "",
    activities: "",
  });

  useEffect(() => {
    if (data?.persona) {
      setPersona(data.persona);
    }
  }, [data]);

  const handleChange = (field, value) => {
    setPersona((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setPersona((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    } else {
      alert("File must be less than 5MB");
    }
  };

  const [createPersona] = useMutation(CREATE_PERSONA, {
    refetchQueries:[{query:GET_PERSONAS}],
    onCompleted: () => navigate("/persona"),
  });

  const [updatePersona] = useMutation(UPDATE_PERSONA, {
    refetchQueries:[{query:GET_PERSONAS}],
    onCompleted: () => navigate("/persona"),
  });

  const [deletePersona] = useMutation(DELETE_PERSONA, {
    refetchQueries:[{query:GET_PERSONAS}],
    onCompleted: () => navigate("/persona"),
  });

  const handleSubmit = async () => {
    if (!persona.name.trim()) {
      alert("Persona Name is required!");
      return;
    }

    const input = {
      name: persona.name,
      image: persona.image || defaultImage,
      quote: persona.quote || "",
      description: persona.description || "",
      attitudes: persona.attitudes || "",
      painPoints: persona.painPoints || "",
      jobs: persona.jobs || "",
      activities: persona.activities || "",
    };
    try{
      if (isEdit && persona.id) {
        await updatePersona({ variables: { id:persona.id, input } });
      } else {
        await createPersona({ variables: { input } });
      }
      navigate("/persona");
    }
    catch(error){
      console.error("Update error:",error);
      alert(`Failed to update Persona:${error.message}`);
    }

   
  };

  const handleDelete = () => {
    deletePersona({ variables: { id } });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: ["sans-serif", "serif"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      ["link"],
      [{ color: ["black", "white", "red", "green", "blue", "grey", "brown", "yellow", "orange"] }],
      ["clean"],
    ],
  };

  return (
    <div className="persona-form">
      <div className="banner" style={{ backgroundImage: `url(${persona.image})` }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} hidden id="imageUpload" />
        <label htmlFor="imageUpload" className="edit-image-btn">Edit Image</label>
      </div>

      <div className="form-container">
        <div className="input-group">
          <label>Persona Name *</label>
          <input type="text" value={persona.name} onChange={(e) => handleChange("name", e.target.value)} required />
        </div>

        <div className="grid-container">
          <div className="grid-item"><label>Notable Quote</label><ReactQuill modules={modules} value={persona.quote} onChange={(value) => handleChange("quote", value)} /></div>
          <div className="grid-item"><label>Description</label><ReactQuill modules={modules} value={persona.description} onChange={(value) => handleChange("description", value)} /></div>
          <div className="grid-item"><label>Attitudes/Motivations</label><ReactQuill modules={modules} value={persona.attitudes} onChange={(value) => handleChange("attitudes", value)} /></div>
        </div>
        <br />
        <div className="grid-container">
          <div className="grid-item"><label>Pain Points</label><ReactQuill modules={modules} value={persona.painPoints} onChange={(value) => handleChange("painPoints", value)} /></div>
          <div className="grid-item"><label>Jobs/Needs</label><ReactQuill modules={modules} value={persona.jobs} onChange={(value) => handleChange("jobs", value)} /></div>
          <div className="grid-item"><label>Activities</label><ReactQuill modules={modules} value={persona.activities} onChange={(value) => handleChange("activities", value)} /></div>
        </div>

        <div className="form-buttons">
          {isEdit && <button className="delete-btn" onClick={handleDelete}>DELETE</button>}
          <button className="close-btn" onClick={() => navigate("/persona")}>CLOSE</button>
          <button className="update-btn" onClick={handleSubmit}>{isEdit ? "UPDATE PERSONA" : "CREATE PERSONA"}</button>
        </div>
      </div>
    </div>
  );
};

export const CreatePersona = () => <PersonaForm isEdit={false} />;
export const EditPersona = () => <PersonaForm isEdit={true} />;
