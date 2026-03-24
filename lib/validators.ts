import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export const employeeCreateSchema = z.object({
  number: z.coerce.number().int().nonnegative(),
  name: z.string().min(2),
  isActive: z.boolean().optional(),
});
export const employeeUpdateSchema = employeeCreateSchema.partial();

export const clientCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  rfc: z.string().optional(),
  isActive: z.boolean().optional(),
});
export const clientUpdateSchema = clientCreateSchema.partial();

export const workTypeSchema = z.enum(["ACABADO","SUAJE","IMPRESION","MAQUINA_SUAJE"]);

export const orderCreateSchema = z.object({
  employeeId: z.string().min(1),
  clientId: z.string().min(1),
  workDate: z.string().min(1),
  workType: workTypeSchema,
  jobTitle: z.string().min(2),
  notes: z.string().optional(),
  payload: z.unknown(),
});

export const receiptCreateSchema = z.object({
  clientId: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  rfc: z.string().optional(),
  items: z.array(z.object({
    orderId: z.string().optional(),
    quantity: z.coerce.number().int().min(1),
    description: z.string().min(1),
    amount: z.coerce.number().min(0),
  })).min(1),
});
