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
    <div className="flex-1 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 p-6">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        
        <div className="form-control">
          <input
            type='text'
            placeholder='Username'
            name="username"
            autoFocus
            required
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <input
            type='password'
            placeholder='Password'
            name="password"
            required
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="btn btn-primary w-full"
        >
          {loginMutation.isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
        
        {loginMutation.isError && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{loginMutation.error.message}</span>
          </div>
        )}

      </form>
    </div>
  )
}
