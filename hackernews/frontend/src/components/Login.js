import React, { useState } from "react";
import { useHistory } from "react-router";
import { AUTH_TOKEN } from "../constants";
import { useMutation, gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;

const SIGNUP_MUTATION = gql`
    mutation Singup($email: String!, $name: String!, $password: String!) {
        signup(email: $email, name: $name, password: $password) {
            token
        }
    }
`;

const Login = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        login: true,
        email: "",
        name: "",
        password: ""
    });

    const [login] = useMutation(LOGIN_MUTATION, {
        variables: {
            email: formData.email,
            password: formData.password
        },
        onCompleted: ({login}) => {
            localStorage.setItem(AUTH_TOKEN, login.token);
            history.push("/");
        }
    });

    const [signup] = useMutation(SIGNUP_MUTATION, {
        variables: {
            email: formData.email,
            name: formData.name,
            password: formData.password
        },
        onCompleted: ({signup}) => {
            localStorage.setItem(AUTH_TOKEN, signup.token);
            history.push("/");
        }
    });

    return ( 
        <div>
            <h4 className="mv3">
                {formData.login ? "Login" : "Sign Up"}
            </h4>
            <div className="flex flex-column">
                <form onSubmit={e => e.preventDefault() }>
                    {!formData.login && (
                        <input type="text"
                          className="mb1"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                        />
                    )}
                    <input type="text"
                        className=""
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Your email address"
                    />
                    <input type="password"
                        className=""
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        placeholder={
                            formData.login ? "Enter your password" : "Choose a safe password"
                        }
                    />                  
                   <div className="flex mt3">
                        <button className="pointer mr2 button" type="submit"
                            onClick={formData.login ? login : signup}
                        >
                            {formData.login ? "Login" : "Sign Up" }
                        </button>
                        <button className="pointer button"
                            onClick={e => 
                                setFormData({ ...formData, login: !formData.login })
                            }
                        >
                            {formData.login ? "need to create a new account?" : "already have an account?" }
                        </button>
                   </div>
                </form>
            </div>
        </div>
     );
}
 
export default Login;
