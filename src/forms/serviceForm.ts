import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const serviceFormSchema = z.object({
  categoryId: z.number().nullable().refine(val => val !== null, {
    message: 'Elegí una categoría',
  }),
  name: z.string().trim().min(1, 'Ingresá un nombre').max(60, 'Máximo 60 caracteres'),
  description: z.string().trim().max(300, 'Máximo 300 caracteres').optional().or(z.literal('')),
  duration: z.string()
    .min(1, 'Ingresá la duración en minutos')
    .regex(/^\d+$/, 'Ingresá la duración en minutos')
    .refine(val => {
      const n = Number(val);
      return n >= 5 && n <= 480;
    }, 'La duración debe ser de 5 a 480 minutos'),
  price: z.string()
    .min(1, 'Ingresá el precio')
    .regex(/^\d+$/, 'Ingresá el precio')
    .refine(val => {
      const n = Number(val);
      return n <= 9999999;
    }, 'El precio es demasiado alto'),
  isActive: z.boolean(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export const serviceFormDefaults = {
  categoryId: null as number | null,
  name: '',
  description: '',
  duration: '',
  price: '',
  isActive: true,
};

export function toServiceInput(values: any) {
  return {
    categoryId: values.categoryId,
    name: values.name,
    description: values.description || null,
    durationMin: Number(values.duration),
    basePrice: Number(values.price),
  };
}

export const serviceFormResolver = zodResolver(serviceFormSchema);
