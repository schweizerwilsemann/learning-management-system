"use server";
import * as chaptersApi from '../lib/apis/chapters';

const createChapterAction = async (courseId: string, { title }: { title: string }) => {
    return chaptersApi.createChapter(courseId, { title });
};

const reorderChaptersAction = async (courseId: string, list: any) => {
    return chaptersApi.reorderChapters(courseId, list);
};

const updateChapterAction = async (chapterId: string, courseId: string, values: any) => {
    return chaptersApi.updateChapter(chapterId, { courseId, values });
};

const deleteChapterAction = async (chapterId: string, courseId: string) => {
    return chaptersApi.deleteChapter(chapterId, { courseId });
};

const publishChapterAction = async (chapterId: string, courseId: string) => {
    return chaptersApi.publishChapter(chapterId, { courseId });
};

const unpublishChapterAction = async (chapterId: string, courseId: string) => {
    return chaptersApi.unpublishChapter(chapterId, { courseId });
};

export {
    createChapterAction,
    reorderChaptersAction,
    updateChapterAction,
    deleteChapterAction,
    publishChapterAction,
    unpublishChapterAction,
};