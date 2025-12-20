import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouterContextState } from "./lib/use-router-context-state";
import { initApiClient } from "./lib/apiClient";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    userToken: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const routerContextState = useRouterContextState();

  initApiClient(() => routerContextState.userToken);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{
          queryClient,
          ...routerContextState,
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
