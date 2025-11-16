export type UserRole = 'USER' | 'ADMIN'

export interface ApiUserModel {
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    // TODO: address will be an object, change it after dev(testing) phase
    address: string | null,
    createdOn: string,
    updatedAt: string,
    roles: UserRole[]
}
