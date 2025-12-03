export interface Idea {
    id: number;
    title: string;
    description: string;
    userId: string | null;
    groupId: number | null;
    createdAt: string;
    voteCount: number;
}

export interface CreateIdeaDto {
    title: string;
    description: string;
    category: string;
    priority: string;
}
