import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import z from 'zod'
import { useMutation } from '@tanstack/react-query';
import { env } from '../lib/env';


export const Route = createFileRoute('/login')({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.string().default("/")
  }),
  beforeLoad: async ({ context, search }) => {
    const { isAuthenticated } = context;
    if (isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  pendingComponent: () => <div>Loading...</div>
})

const loginSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .trim(),
  password: z.string()
    .min(3, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
});

type LoginCredentials = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
}

const loginUser = async ({ username, password }: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${env.apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

function RouteComponent() {
  const { login } = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      login(data.token);

      await router.invalidate();

      navigate({ to: search.redirect })
    },
    onError: (error) => {
      console.error("Login error: ", error)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const validatedData = loginSchema.parse({
      username: formData.get('username'),
      password: formData.get('password')
    });

    loginMutation.mutate({ username: validatedData.username, password: validatedData.password });

  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-bold">Login</h1>
        
        <div>
          <input
            type='text'
            placeholder='Username'
            name="username"
            autoFocus
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <input
            type='password'
            placeholder='Password'
            name="password"
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
        
        {loginMutation.isError && (
          <p className="rounded bg-red-50 p-3 text-sm text-red-700">
            {loginMutation.error.message}
          </p>
        )}

      </form>
    </div>
  )
}
