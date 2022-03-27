import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import loadable from "@loadable/component";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = loadable(() => import("./App"));
const Foo = loadable(() => import("./routes/Foo"));
const Bar = loadable(() => import("./routes/Bar"));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/foo" element={<Foo />} />
        <Route path="/bar" element={<Bar />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
