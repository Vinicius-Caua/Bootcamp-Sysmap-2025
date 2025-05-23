type userData = {
    name: string;
    email: string;
    cpf: string;
    password: string;
    avatar?: string | null;
    xp: number;
    level: number;
    deletedAt?: Date | null;
}

export default userData;