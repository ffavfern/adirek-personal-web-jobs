import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { gsap } from 'gsap';
import 'tailwindcss/tailwind.css';
import 'daisyui/dist/full.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from('.login-form', { opacity: 0, y: 50, duration: 1 });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error signing in with password and email', error);
      alert('Error signing in with password and email');
    }
  };

  return (
    
     <>
     <div className="flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-sm shadow-2xl  bg-secondary  login-form">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold mb-6 text-black">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text ">Email</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-error w-full">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
     </>
   
    
  );
};

export default Login;