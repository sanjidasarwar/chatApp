import React, { useState } from "react";
import "./Login.css";
import { logoBig } from "../../assets";
import { login, signup } from "../../config/firebase";

function Login() {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentState === "Sign Up") {
      signup(username, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="login">
      <img className="logo" src={logoBig} alt="" />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{currentState}</h2>
        {currentState === "Sign Up" && (
          <input
            className="form-input"
            type="text"
            placeholder="username"
            required=""
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        )}

        <input
          className="form-input"
          type="email"
          placeholder="Email address"
          required=""
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="form-input"
          type="password"
          placeholder="password"
          required=""
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit">
          {currentState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use &amp; privacy policy.</p>
        </div>
        <div className="login-forgot">
          {currentState === "Sign Up" ? (
            <p className="login-toggle">
              Already have an account?
              <span onClick={() => setCurrentState("Login")}>Login here</span>
            </p>
          ) : (
            <>
              <p className="login-toggle">
                Create an account
                <span onClick={() => setCurrentState("Sign Up")}>
                  Click here
                </span>
              </p>
              <p className="login-toggle">
                Forgot Password ?
                <span onClick={() => setCurrentState("Login")}>Click here</span>
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
