import { Button } from "antd";
import "antd/es/button/style/index.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import lodash from 'lodash-es';
import { Notification } from '@arco-design/web-react';

let a = 1;
lodash.debounce(() => {
  a++;
  console.log(a);
  console.log(123)
})
const DynamicComponent = lazy(() => import("./components/Dynamic/Dynamic"));

const App = () => {
  console.log(a)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route
            index
            element={
              <Link to="/dynamic">
                <Button>查看动态 import 的组件</Button>
                <Notification />
              </Link>
            }
          />
          <Route
            path="dynamic"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DynamicComponent />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
