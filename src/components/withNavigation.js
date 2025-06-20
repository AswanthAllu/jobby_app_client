import { useNavigate } from 'react-router-dom';

// This is a Higher-Order Component (HOC)
// It takes a component as an argument...
const withNavigation = (Component) => {
  // ...and returns a new component that wraps it
  return (props) => {
    // It uses the hook and passes the navigate function as a prop
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
};

export default withNavigation;