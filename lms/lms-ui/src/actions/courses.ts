"use server";
import * as coursesApi from '../lib/apis/courses';

const createCourseAction = async ({ title }: { title: string }) => {
    return coursesApi.createCourse({ title });
};

const updateCourseAction = async (courseId: string, values: any) => {
    return coursesApi.updateCourse(courseId, values);
};

const deleteCourseAction = async (courseId: string) => {
    return coursesApi.deleteCourse(courseId);
};

const publishCourseAction = async (courseId: string) => {
    return coursesApi.publishCourse(courseId);
};

const unpublishCourseAction = async (courseId: string) => {
    return coursesApi.unpublishCourse(courseId);
};

const getPurchasesAndRevenueAction = async (courseId: string) => {
    return coursesApi.getCourseAnalytics(courseId);
};

export {
    createCourseAction,
    updateCourseAction,
    deleteCourseAction,
    publishCourseAction,
    unpublishCourseAction,
    getPurchasesAndRevenueAction,
};
