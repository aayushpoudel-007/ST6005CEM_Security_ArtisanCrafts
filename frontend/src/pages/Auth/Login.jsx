import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import artisanCrafts from "../../components/artisancrafts.png"; // Import the new image
import DOMPurify from 'dompurify';

// Function to sanitize text input
const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input);
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Sanitize user inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateEmail(sanitizedEmail)) {
      setEmailError("Invalid email address");
      return;
    } else {
      setEmailError("");
    }

    try {
      const res = await login({ email: sanitizedEmail, password: sanitizedPassword }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <section className="flex h-screen">
      {/* Form Section */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800">Sign In</h1>
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-black text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-gray-800 transition duration-300"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
            {isLoading && <Loader />}
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-pink-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-1/2 flex items-center justify-center bg-gray-200">
        <img
          src={artisanCrafts}
          alt="Artisan Crafts"
          className="w-full h-full object-cover rounded-l-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default Login;
