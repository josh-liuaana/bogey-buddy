import {
  collection,
  type DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

import type { Course, CourseWithId } from "@/types/course";

import { db } from "../../firebase";

interface CourseContextType {
  selectedCourse: CourseWithId | null;
  setSelectedCourse: (course: CourseWithId | null) => void;
  courseList: CourseWithId[] | null;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [selectedCourse, setSelectedCourse] = useState<CourseWithId | null>(
    null
  );
  const [courseList, setCourseList] = useState<CourseWithId[] | null>(null);

  useEffect(() => {
    // Fetch courses from Firestore
    const fetchCourses = async () => {
      console.log("Fetching courses...");

      const coursesCollection = collection(db, "courses");
      const courseSnapshot = await getDocs(coursesCollection);

      const rawCourseList: CourseWithId[] = courseSnapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data() as Course;
          return {
            id: doc.id,
            ...data,
          };
        }
      );
      setCourseList(rawCourseList);
    };
    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider
      value={{ selectedCourse, setSelectedCourse, courseList }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within CourseProvider");
  }
  return context;
}
