import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { clearAuthError } from '../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.auth);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold text-white mb-6">Register</h1>
      {error && <div className="mb-4 text-red-400">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Username</label>
          <input name="username" className="input-field" value={form.username} onChange={onChange} required />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input name="email" type="email" className="input-field" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input name="password" type="password" className="input-field" value={form.password} onChange={onChange} required />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="text-gray-300 text-sm mt-4">
        Have an account? <Link to="/login" className="text-primary-400">Login</Link>
      </p>
    </div>
  );
};

export default Register;






