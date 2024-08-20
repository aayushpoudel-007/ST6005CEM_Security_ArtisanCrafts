import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import artisanCrafts from "../../components/artisancrafts.png"; // Import the new image
import DOMPurify from 'dompurify';

// Function to sanitize text input
const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input);
};

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
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

  const validatePassword = (password) => {
    const lengthCriteria = password.length >= 8 && password.length <= 12;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!lengthCriteria) {
      return "Password must be between 8 to 12 characters";
    }
    if (!uppercaseCriteria || !lowercaseCriteria || !numberCriteria || !specialCharCriteria) {
      return "Password must include uppercase letters, lowercase letters, numbers, and special characters";
    }
    return "";
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
    const error = validatePassword(password);
    setPasswordError(error);

    if (!error) {
      // Real-time feedback on password strength
      const strength = password.length >= 12 ? "Strong" : "Weak";
      setPasswordStrength(strength);
    } else {
      setPasswordStrength("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Sanitize user inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateEmail(sanitizedEmail)) {
      setEmailError("Invalid email address");
      return;
    } else {
      setEmailError("");
    }

    const passwordError = validatePassword(sanitizedPassword);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    } else if (sanitizedPassword !== sanitizeInput(confirmPassword)) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username: sanitizedUsername, email: sanitizedEmail, password: sanitizedPassword }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User successfully registered");
    } catch (err) {
      console.log(err);
      toast.error(err.data.message);
    }
  };

  return (
    <section className="flex h-screen">
      {/* Form Section */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800">Create Your Account</h1>
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
              {passwordStrength && <p className={`text-xs mt-1 ${passwordStrength === "Strong" ? "text-green-500" : "text-yellow-500"}`}>{`Password Strength: ${passwordStrength}`}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-black text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-gray-800 transition duration-300"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
            {isLoading && <Loader />}
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-pink-500 hover:underline"
              >
                Login
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-2">Please remember to change your password every 90 days for security reasons.</p>
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

export default Register;
