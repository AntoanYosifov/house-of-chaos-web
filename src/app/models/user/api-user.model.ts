export type UserRole = 'USER' | 'ADMIN'

export interface ApiUserModel {
    id: string,
    email: string,
    createdOn: string,
    updatedAt: string,
    roles: UserRole[]
}
