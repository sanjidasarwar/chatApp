import { useContext, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const [currentState, setCurrentState] = useState("Login");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    password: "",
  });

  const { login, formErrors } = useContext(AuthContext);

  const handleCurrentState = (state) => {
    setCurrentState(state);
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    const payload =
      currentState === "Sign Up"
        ? {
            name: formData.name,
            userName: formData.userName,
            password: formData.password,
          }
        : {
            userName: formData.userName,
            password: formData.password,
          };

    login(
      currentState === "Sign Up" ? "register" : "login",
      payload,
      handleCurrentState
    );
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{currentState}</h2>
        {currentState === "Login" ? (
          <input
            className="form-input"
            type="text"
            placeholder="Enter Name/Email"
            required=""
            name="userName"
            value={formData.userName}
            onChange={(e) => handleChange(e)}
          />
        ) : (
          <>
            <input
              className="form-input"
              type="text"
              placeholder="Enter Name"
              required=""
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e)}
            />

            <input
              className="form-input"
              type="email"
              placeholder="Email address"
              required=""
              name="userName"
              value={formData.email}
              onChange={(e) => handleChange(e)}
            />
          </>
        )}
        {formErrors.userName && (
          <p className="error-text">{formErrors.userName}</p>
        )}
        <div className="password-field">
          <input
            className="form-input"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            required=""
            name="password"
            value={formData.password}
            onChange={(e) => handleChange(e)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        {formErrors.password && (
          <p className="error-text">{formErrors.password}</p>
        )}

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
