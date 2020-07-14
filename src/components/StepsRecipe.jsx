import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title } from "../style/styles";
import UploadFile from "./UploadFile";


export default ({setUrl,setPaso}) => {

    const [session, setSession] = useRecoilState(sessionState);
    const [errorMessage, setErrorMessage] = useState("");
  
    return (
  
      <Step>
  
        <Title>Añadir Paso</Title>
        <Input id="paso" type="text" placeholder="Añadir Paso"></Input>
        <Button
              onClick={() => {

                setPaso(document.getElementById("paso").value);

              }}
            >
              Añadir Paso
            </Button>
        <UploadFile setUrl = {setUrl}></UploadFile>
        
      </Step>
  
    );
  };
  
  
  const Step = styled.div`
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