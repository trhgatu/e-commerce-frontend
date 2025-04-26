// src/types/user.ts
export interface IUser {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin' | 'moderator' | 'seller';
    createdAt: string;
    updatedAt: string;
}