export interface ICourses {
    id: number;
    courseName: string;
    courseTitle: string,
    courseThumbnail: string;
    tags: string[] | null;
    price: number | null;
    discount: number | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
