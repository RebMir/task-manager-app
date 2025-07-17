import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import Textbox from '../components/Textbox';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice'
import UserInfo from '../components/ViewNotification';

const Login = () => {
  const { user } = useSelector((state) => state.auth); // Optional if using Redux
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  // Email/Password login handler
  const submitHandler = async (data) => {
    const { email, password } = data;
    setErrorMsg("");
    console.log("Login attempt with email:", email);

  try {
    // Capture the result of the sign-in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login success:", userCredential.user);
    const firebaseUser = userCredentials.user

    dispatch(setCredentials({
      email: firebaseUser.user.email,
      uid: firebaseUser.user.uid,
      displayName: firebaseUser.user.displayName.user.displayName || "",
    }));

    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
    console.log("Navigated to /dashboard");
  } catch (error) {
    console.error("Login error code:", error.code);
    console.error("Login error:", error.message);
    console.error("Full error object:", error);
    setErrorMsg("Invalid email or password.");
  }
};

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      dispatch(setCredentials({
        email: user.email,
        uid: user.uid,
        displayName: user.displayName || "",
      }));

      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      setErrorMsg("Google sign-in failed. Try again.");
    }
  };

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* Left Side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
              Manage all your tasks in one place!
            </span>
            <p className='flex flex-col gap-0 md:gap-6 text-4xl md:text-6xl 2xl:text-7xl font-bold text-center text-blue-700'>
              <span>Cloud-Based</span>
              <span>Task Manager</span>
            </p>
            <div className="inline-block w-[49%] text-center">
              <div className="inline-block w-[100px] h-[100px] rounded-full bg-blue-500 shadow-[4px_-40px_60px_5px_inset] animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className=''>
              <p className='text-blue-600 text-3xl font-bold text-center'>Welcome back!</p>
              <p className='text-center text-base text-gray-700'>Keep your credentials safe.</p>
            </div>

            {errorMsg && (
              <div className="bg-red-100 text-red-700 p-2 rounded text-center">
                {errorMsg}
              </div>
            )}

            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full p-3 border border-gray-300 rounded-md'
                register={register("email", {
                  required: "Email is required",
                })}
                error={errors.email ? errors.email.message : ""}
              />

              <Textbox
                placeholder='Your Password'
                type='password'
                name='password'
                label='Password'
                className='w-full p-3 border border-gray-300 rounded-md'
                register={register("password", {
                  required: "Password is required",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <span className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer'>
                Forgot Password?
              </span>

              <Button
                type='login'
                label='Login'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-full gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full py-2 font-semibold"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
