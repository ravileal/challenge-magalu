import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      return reply.status(404).send({ message: error.message });
    }
  }

  request.log.error(error);

  return reply.status(500).send({ message: 'Internal Server Error' });
}
