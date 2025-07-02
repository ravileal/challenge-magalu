import { FastifyRequest, FastifyReply } from 'fastify';

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
}
