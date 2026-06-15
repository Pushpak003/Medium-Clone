import { useState } from "react";
import InputBox from "../components/Input.component";
import googleIcon from "../imgs/google.png";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AnimationWrapper from "../common/Page-animation";
import api from "../utils/api";
import { authWithGoogle } from "../common/firebase";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../redux/authSlice";

const UserAuthForm = ({ type }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // GuestRoute already redirect karti hai agar logged in ho
  // Yahan dobara check ki zaroorat nahi

  const from = location.state?.from?.pathname || "/";

  const signup = async (fullname, email, password) => {
    try {
      const { data } = await api.post("/auth/signup", { fullname, email, password });
      dispatch(authenticate(data));
      navigate(from, { replace: true });
    } catch ({ response }) {
      toast.error(response?.data?.error || "Signup failed");
    }
  };

  const signin = async (email, password) => {
    try {
      const { data } = await api.post("/auth/signin", { email, password });
      dispatch(authenticate(data));
      navigate(from, { replace: true });
    } catch ({ response }) {
      toast.error(response?.data?.error || "Signin failed");
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      const googleUser = await authWithGoogle();
      const { data } = await api.post("/auth/google", {
        access_token: googleUser.accessToken,
      });
      dispatch(authenticate(data));
      navigate(from, { replace: true });
    } catch {
      toast.error("Trouble signing in with Google");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (type === "sign-up" && fullname.length < 3) {
      return toast.error("Fullname must be at least 3 characters");
    }
    if (!email.length) return toast.error("Enter email");
    if (!emailRegex.test(email)) return toast.error("Email is invalid");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    if (type === "sign-in") signin(email, password);
    else signup(fullname, email, password);
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <form className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
          <Toaster />
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome back" : "Join us today"}
          </h1>

          {type === "sign-up" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
              onChange={(e) => setFullname(e.target.value)}
            />
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-dark center mt-14">{type.replace("-", " ")}</button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} alt="googleIcon" className="w-5" />
            Continue with Google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us Today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;