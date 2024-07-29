import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { gsap } from 'gsap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from('.login-form', { opacity: 0, y: 50, duration: 1 });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-96 bg-base-100 shadow-xl login-form">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input input-bordered w-full"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input input-bordered w-full"
            />
            <button type="submit" className="btn btn-primary w-full">Login</button>
          </form>
          {user && (
            <div className="mt-4 text-center">
              <p className="text-success">Welcome, {user.email}!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
