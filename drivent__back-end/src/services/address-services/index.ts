import { prisma } from "@/config";

interface Props {
    id: number
    cep: string,
    street: string,
    city: string,
    number: string,
    state: string,
    neighborhood: string,
    addressDetail?: string
}

export default async function createOrUpdateAddressData(props: Props) {
    const {id, cep,
        street,
        city,
        state,
        number,
        neighborhood,
        addressDetail} = props

    
    const createOrUpdateData = {
            enrollmentId: id,
              cep,
              street,
              city,
              number,
              state,
              neighborhood,
              ...(addressDetail && { addressDetail: addressDetail }),
            }

    await prisma.address.upsert({
        where: {
            enrollmentId: id
        },
        create: createOrUpdateData,
        update: createOrUpdateData
    })
}