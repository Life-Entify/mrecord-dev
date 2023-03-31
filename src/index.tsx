import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Provider } from "ui";
import { Provider as ReduxProvider } from "react-redux";
import { AppInitAdapter } from "./app/init";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import store from "app/redux/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ReduxProvider store={store}>
        <AppInitAdapter>
          <Provider
            appTheme={{
              // colorPrimary: "red",
              infoBoardBg: "#f6f6f6",
            }}
          >
            <App />
          </Provider>
        </AppInitAdapter>
      </ReduxProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
