import { useRef, useState, useEffect } from "react";
// import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import useAuth from "./hooks/useAuth";

const LOGIN_URL = "/auth";

const Login = () => {
  // const { setAuth } = useContext(AuthContext);
  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const onsubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: {
            "Content-Type": "application/json",
            withCredential: true,
          },
        }
      );
      console.log(response?.data);
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      setAuth({ user, pwd, roles, accessToken });

      setUser("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="#"></a>Go to Home
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={onsubmitHandler}>
            <label htmlFor="username">Username:</label>
            <input
              required
              value={user}
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => {
                setUser(e.target.value);
              }}
            />
            <label htmlFor="password">Password:</label>
            <input
              required
              value={pwd}
              type="password"
              id="password"
              onChange={(e) => {
                setPwd(e.target.value);
              }}
            />
            <button>Sign In</button>
          </form>
          <p>
            Need an Account? <br />
            <span className="line">
              {/* {put router link here} */}
              <a href="">Sign Up</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
