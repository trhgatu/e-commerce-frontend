// src/components/common/Header.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
/* import { useAppSelector, useAppDispatch } from '@/hooks';
import { logout } from '@/store/authSlice'; */

const Header: React.FC = () => {
 /*  const { isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  }; */

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Tech E-commerce
        </Link>
        <nav className="flex space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/cart">Cart</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/orders">Orders</Link>
          </Button>
                  {/* {isAuthenticated ? (
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )} */}
        </nav>
      </div>
    </header>
  );
};

export default Header;