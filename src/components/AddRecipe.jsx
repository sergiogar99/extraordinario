import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title } from "../style/styles";
import StepsRecipe from "./StepsRecipe";
import UploadFile from "./UploadFile";
import AddIngredient from "./AddIngredient";
// addRecipe(
//   userid: ID!
//   token: String!
//   title: String!
//   description: String!
//   steps: [StepInput!]!
//   ingredients: [ID!]!
//   mainImage: FileInput!
// ): Recipe!

const ADD_RECIPE_MUTATION = gql`
  mutation add_recipe($userid: ID!, $token: String!, $title: String!,$description:String!,$steps:[StepInput!]!,$ingredients: [ID!],$mainImage: FileInput! ) {
    add_recipe(userid:$userid,token:$token,title:$title,description:$description,steps:$steps,ingredients:$ingredients,mainImage:$mainImage) {
      _id
      title
      description
      steps
      date
      ingredients
      mainImage
      author
    }
  }
`;

export default () => {

  const [session, setSession] = useRecoilState(sessionState);
  const [errorMessage, setErrorMessage] = useState("");

  const [addrecipeMutation, { data }] = useMutation(ADD_RECIPE_MUTATION, {
    onError(error) {
      setSession({
        userid: "",
        token: "",
        logged: false,
      });
      if (error.message.includes("Non existent or not authorized")) {
        console.error("Usuario o contraseña no válidos");
        setErrorMessage("Usuario o contraseña no válidos");
      } else {
        setErrorMessage(
          "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde",
        );
      }
    },
  });

  //userid:$userid,token:$token,title:$title,description:$description,steps:$steps,ingredients:$ingredients,mainImage:$mainImage
  const addRecipe = (title,description,steps,ingredients,mainImage) => {
    addrecipeMutation({
      variables: { userid:session.userid, token: session.token,title,description,steps,ingredients,mainImage},
    });
  };

  if (data) {

    return(

      <Recipe>
        <p>{data.add_recipe.title}</p>
      </Recipe>

    );
   
  }

  const [url1,setUrl1] = useState("");
  const [url2,setUrl2] = useState("");
  const [url3,setUrl3] = useState("");

  const [paso1,setPaso1] = useState("");
  const [paso2,setPaso2] = useState("");
  const [paso3,setPaso3] = useState("");

  const [ingredients,setIdIngrediente] = useState("");

  const [urlMain,setUrlMain] = useState("");

  return (

    <Recipe>

        <Title>Añadir Receta</Title>

        {session.logged
        ? (
          <Recipe>

            <Input id="title" type="text" placeholder="Titulo Receta"></Input>
            <Input id="descripcion" type="text" placeholder="Descripcion Receta"></Input>
            <StepsRecipe setPaso = {setPaso1} setUrl = {setUrl1}></StepsRecipe>
            <StepsRecipe setPaso = {setPaso2} setUrl = {setUrl2}></StepsRecipe>
            <StepsRecipe setPaso = {setPaso3} setUrl = {setUrl3}></StepsRecipe>
            <AddIngredient setId = {setIdIngrediente}></AddIngredient>
            <UploadFile setUrl = {setUrlMain}></UploadFile>

            <Button
              onClick={() => {

                addRecipe(
                  document.getElementById("title").value,
                  document.getElementById("descripcion").value,
                  [[paso1,url1],[paso2,url2],[paso3,url3]],
                  ingredients,
                  urlMain


                );
                
                console.log("title:"+ document.getElementById("title").value);
                console.log("descriptio:"+ document.getElementById("descripcion").value);
                console.log("Paso1:" +paso1 );
                console.log("url1:"+ url1);
                console.log("Paso2:" +paso2);
                console.log("url2:"+ url2);
                console.log("Paso3:" +paso3);
                console.log("url3:"+ url3);
                console.log(ingredients);
                console.log("Main Image Url" + urlMain);


              }}
            >
              Añadir Receta
            </Button>

          </Recipe>
        )
        : (

          <div>Para añadir receta tienes que estar registrado</div>

        )}
    </Recipe>

  );
};


const Recipe = styled.div`
  color: #333333;
  margin: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  border: 1px solid #333;
  height: 30px;
  width: 500px;
`;

const Button = styled.button`
  color: black;
  font-weight: bold;
  height: 30px;
  width: 500px;
  border: 1px solid #333;
  &:hover {
    background-color: #bbbbbb;
    cursor: pointer;
  }
`;