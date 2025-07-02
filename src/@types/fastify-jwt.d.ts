import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { clientId: string };
    user: {
      clientId: string;
    };
  }
}
