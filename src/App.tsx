import { EuiProvider, euiStylisPrefixer } from "@elastic/eui";
import createCache from "@emotion/cache";
import { RouterProvider } from "react-router-dom";
import "./App.css";

//css
import "@elastic/eui/dist/eui_theme_light.min.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import router from "./_setup/router/routes";

const container = document.querySelector('meta[name="emotion-styles"]');
const cache = createCache({
  key: "eui",
  container: container || undefined,
  stylisPlugins: [euiStylisPrefixer],
});
cache.compat = true;

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <EuiProvider colorMode="light" cache={cache}></EuiProvider>
    </QueryClientProvider>
  );
}

export default App;
