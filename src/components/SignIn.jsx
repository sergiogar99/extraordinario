import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title } from "../style/styles";

const ADD_USER_MUTATION = gql`
mutation signin($userName: String!, $pwd: String!) {
    signin(userName: $userName, pwd: $pwd) {
      _id
      token
    }
  }
`;

export default () =>{

    const [session, setSession] = useRecoilState(sessionState);
    const [errorMessage, setErrorMessage] = useState("");

    const [signinMutation, { data }] = useMutation(ADD_USER_MUTATION, {
        onError(error) {
        console.log(error)
        setSession({
            userid: "",
            token: "",
            logged: false,
        });
        if (error.message.includes("GraphQL error: MongoError: E11000 duplicate key error collection:")) {
            console.error("El usuario ya existe.");
            setErrorMessage("El usuario ya existe.");
        } else {
            setErrorMessage(
            "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde",
            );
        }
        },
    });

    const signin = (userName, pwd) => {
        signinMutation({
        variables: { userName, pwd },
        });
        
    };

    if (data) {
        if (session.token !== data.signin.token) {
          setSession({
            userid: data.signin._id,
            token: data.signin.token,
            logged: true,
          });
          setErrorMessage("");
        }
    }


    return(

    
        <Singin>
            <Title>Register</Title>
            {errorMessage !== "" ? <Error>{errorMessage}</Error>: null}

            {session.logged
            ? (
                <OK>Usuario Registrado Con Exito</OK>
              )
              : (

                <Singin>
                    <Input
                    id="userName"
                    type="text"
                    placeholder="Nombre de usuario"
                    >
                    </Input>
                    <Input id="pwd1" type="password" placeholder="Contraseña"></Input>
                    <Input id="pwd2" type="password" placeholder="Repite Contraseña"></Input>
                    <Button
                    onClick={() => {

                        //Comprobacion de que las dos contraseñas coinciden.
                        if(document.getElementById("pwd1").value === document.getElementById("pwd2").value){

                            signin(
                                document.getElementById("userName").value,
                                document.getElementById("pwd1").value,
                            );

                        }else{
                            //Gestion del error si las dos contraseñas no coinciden.
                            setErrorMessage("Las contraseñas introducidas no son iguales");
                        }
                        
                    }}>
                    Enviar
                    </Button>
                </Singin>

            )}
            
            
        </Singin>
    )
};

const Singin = styled.div`
  color: #333333;
  margin: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
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