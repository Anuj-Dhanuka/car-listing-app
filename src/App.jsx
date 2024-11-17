//Styles
import { Provider } from "react-redux";
import "./App.css";

//Navigations
import Navigations from "./navigations";

//Redux
import store from "./redux/store";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Provider store={store}>
          <Navigations />
        </Provider>
      </AuthProvider>
    </>
  );
}

export default App;
