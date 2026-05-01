import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('ir_user')) || null,
  token: localStorage.getItem('ir_token') || null,
  loading: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('ir_token', action.payload.token);
      localStorage.setItem('ir_user', JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case 'UPDATE_USER':
      localStorage.setItem('ir_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('ir_token');
      localStorage.removeItem('ir_user');
      return { ...state, user: null, token: null, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const isAdmin = () => state.user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
