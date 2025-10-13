export type Course = {
  title: string;
  par: number;
  holes: HoleAttributes[];
};

export interface CourseWithId extends Course {
  id: string;
}

type HoleAttributes = {
  par: number;
  distance: number;
  stroke: number;
};
