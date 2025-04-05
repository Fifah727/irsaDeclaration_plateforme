import React from 'react';
//import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import './App.css';
import AppRouter from './routes/AppRouter';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import {Link} from "react-router-dom";
// import {Navbar,Nav} from "react-bootstrap";
function App() {
  return (
    <div>
      <AppRouter /> {/* AppRouter gère le contexte BrowserRouter */}
    </div>
  );
}

export default App;

