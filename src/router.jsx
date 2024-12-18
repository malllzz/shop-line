import { createBrowserRouter, redirect } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'cart',
        element: <Cart />,
        loader: () => {
          if (!localStorage.getItem('access_token')) {
            return redirect('/login');
          }
          return null;
        },
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
      },
    ],
  },
]);

export default router;
