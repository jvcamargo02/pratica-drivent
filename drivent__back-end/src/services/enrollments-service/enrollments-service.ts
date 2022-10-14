import { prisma } from '@/config';
import createOrUpdateAddressData from '../address-services';

export async function getOneWithAddressByUserId(userId: number) {
  const enrollmentWithAddress = await prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });

  if (!enrollmentWithAddress) return undefined;

  const firstAddress = enrollmentWithAddress.Address[0];
  const address = firstAddress
    ? {
        id: firstAddress.id,
        cep: firstAddress.cep,
        street: firstAddress.street,
        city: firstAddress.city,
        state: firstAddress.state,
        number: firstAddress.number,
        neighborhood: firstAddress.neighborhood,
        addressDetail: firstAddress.addressDetail,
      }
    : null;

  return {
    id: enrollmentWithAddress.id,
    name: enrollmentWithAddress.name,
    cpf: enrollmentWithAddress.cpf,
    birthday: enrollmentWithAddress.birthday,
    phone: enrollmentWithAddress.phone,
    ...(!!address && { address }),
  };
}

export async function createOrUpdateEnrollmentWithAddress(params: CreateEnrollmentParams) {
  const createOrUpdateParams = {
    name: params.name,
    cpf: params.cpf,
    birthday: params.birthday,
    phone: params.phone,
    userId: params.userId,
  };

  const enrollmentData = await prisma.enrollment.upsert({
    where: {
      userId: params.userId,
    },
    create: createOrUpdateParams,
    update: createOrUpdateParams,
    include: {
      Address: true,
    },
  });

  return await createOrUpdateAddressData({
    id: enrollmentData.id, cep: params.address.cep, addressDetail: params.address.addressDetail, state: params.address.state, street: params.address.street, neighborhood: params.address.neighborhood,
     number: params.address.number, city: params.address.city
  })
}

export type CreateEnrollmentParams = {
  name: string;
  cpf: string;
  birthday: string;
  phone: string;
  userId: number;
  address: {
    cep: string;
    street: string;
    city: string;
    number: string;
    state: string;
    neighborhood: string;
    addressDetail?: string;
  };
};
