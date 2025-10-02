export type Course = {
  title: string;
  par: number;
};

export interface CourseWithId extends Course {
  id: string;
}
