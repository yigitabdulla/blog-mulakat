import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import SubmitPost from './pages/SubmitPost';
import VotingScreen from './pages/VotingScreen';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import Blogs from './pages/Blogs';
import CreateTournament from './pages/CreateTournament';
import TournamentDetail from './pages/TournamentDetail';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<SubmitPost />} />
            <Route path="/battles" element={<VotingScreen />} />
            <Route path="/vote" element={<VotingScreen />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/results" element={<Results />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/admin/tournaments/create" element={<CreateTournament />} />
            <Route path="/tournaments/:id" element={<TournamentDetail />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
