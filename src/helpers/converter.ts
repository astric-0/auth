import { ClassConstructor, plainToInstance } from 'class-transformer';

export function toInstanceAndExcludeExtras<T, V>(
	obj: V,
	cls: ClassConstructor<T>,
): T {
	return plainToInstance(cls, obj, {
		excludeExtraneousValues: true,
	});
}

export function toInstanceArrayAndExcludeExtras<T, V>(
	obj: V[],
	cls: ClassConstructor<T>,
): T[] {
	return plainToInstance(cls, obj, {
		excludeExtraneousValues: true,
	});
}

export function toInstanceAndIncludeExtras<T, V>(
	obj: V,
	cls: ClassConstructor<T>,
): T {
	return plainToInstance(cls, obj);
}
