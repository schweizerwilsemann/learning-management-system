import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth";
import api from '@/lib/apiClient';
import Preview from "@/components/shared/Preview";
import VideoPlayer from "@/components/shared/VideoPlayer";

interface ChapterIdPageProps {
    params: {
        courseId: string;
        chapterId: string;
    };
};

export async function generateMetadata({ params }: ChapterIdPageProps) {
    const res = await api.get(`/chapters/${params.chapterId}`);
    const chapter = res?.data?.chapter;
    return {
        title: `${chapter?.title}`,
        description: `${chapter?.description}`,
    };
};

const ChaperIdPage = async ({ params }: ChapterIdPageProps) => {

    const res = await api.get(`/chapters/${params.chapterId}`);
    const chapter = res?.data?.chapter;

    if (!chapter) {
        return redirect("/");
    };

    const session = await getServerSession(authOptions);

    const isPurchased = res?.data?.isPurchased;

    if (!chapter?.isFree && !isPurchased) {
        return redirect("/");
    };

    return (
        <div className="p-6">
            <div className="relative aspect-video rounded-lg">
                <VideoPlayer
                    title={chapter?.title}
                    autoPlay
                    resolutions={chapter?.resolutions.sort()!}
                />
            </div>
            <h1 className="text-2xl font-bold mt-4 text-sky-700">{chapter?.title}</h1>
            <div className="mt-8">
                <div className="w-full flex items-center">
                    <h3 className="font-bold text-xl lg:text-2xl text-black/80" >Course description</h3>
                </div>
                <div className="mt-4">
                    <Preview
                        value={chapter.description!}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChaperIdPage;