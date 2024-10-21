import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData, useNavigate} from "@remix-run/react";
import {useState} from "react";
import {createSupabaseServerClient} from "~/services/upabase.server";
import {LessonDetails, toLessonDetails} from "~/models/LessonDetails";

export const loader = async ({params, request}: LoaderFunctionArgs) => {
    const {supabase} = createSupabaseServerClient(request);
    const {data} = await supabase.from('lessons').select('id, title, courses(id, title), challenges(*, challenge_options(*))').match({id: Number(params['id'])}).single();
    return json(toLessonDetails(data));
};

enum Status {
    question = "QUESTION",
    correct = "CORRECT",
    wrong = "WRONG"
}

const LessonPage = () => {
    const navigate = useNavigate();
    const currentLesson = useLoaderData<LessonDetails>();
    // const questions = useLoaderData<typeof loader>();
    const [currentChallenge, setCurrentChallenge] = useState(currentLesson.challenges[0])
    const [currentAnswer, setCurrentAnswer] = useState<number | null>(null)
    const [status, setStatus] = useState<Status>(Status.question)

    const answer = () => {
        const correctAnswer = currentChallenge.options.find((option) => option.correct)
        if (currentAnswer === correctAnswer?.id) {
            setStatus(Status.correct)
        } else {
            setStatus(Status.wrong)
        }
    }
    const nextQuestion = () => {
        const currentQuestionIndex = currentLesson.challenges.indexOf(currentChallenge);
        if (currentQuestionIndex + 1 < currentLesson.challenges.length) {
            setCurrentChallenge(currentLesson.challenges[currentQuestionIndex + 1])
            setStatus(Status.question)
            setCurrentAnswer(null)
        } else {
            navigate(`/courses/${currentLesson.course.id}`)
        }
    }


    return (
        <section className="w-screen h-screen flex flex-col items-center pt-10">
            <div
                className="pb-3 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
                <i onClick={() => {navigate(`/courses/${currentLesson.course.id}`)}} className="text-3xl text-slate-500 hover:opacity-75 transition cursor-pointer ri-close-large-line"></i>
                <div className="w-full bg-gray-200 rounded-full h-3.5  dark:bg-gray-700">
                    <div className="bg-green-400 h-3.5 rounded-full" style={{width: "45%"}}></div>
                </div>
                <div className="flex items-center font-bold">
                    <i className="ri-heart-fill text-3xl text-red-500"></i>
                </div>
            </div>
            {
                currentLesson.challenges.length > 0 && (
                    <>
                        <div className="py-8 w-full flex flex-grow max-w-[768px] mx-auto items-center">
                            <div className="block w-full">
                                <h3 className="font-bold text-xl text-right">{currentChallenge.question}</h3>
                                <div className="text-right flex flex-col my-4">
                                    {
                                        currentChallenge.options.map(option => (
                                            <button onClick={() => setCurrentAnswer(option.id)} key={option.id}
                                                    className={`inline-block p-4 rounded-md text-center my-2 cursor-pointer ${currentAnswer === option.id ? 'text-white bg-green-400' : 'bg-gray-200 text-gray-600'}`}>{option.text}</button>
                                        ))
                                    }
                                </div>
                            </div>

                        </div>
                        {status === Status.question && (
                            <div className="border-t-2 w-full p-4">
                                <div className="max-w-[1140px] mx-auto">
                                    <button
                                        disabled={currentAnswer === null}
                                        onClick={answer}
                                        className={`inline-block py-4 px-8 font-bold rounded-md text-center my-2 cursor-pointer ${currentAnswer === null ? 'bg-gray-200 text-gray-600' : 'text-white bg-green-400'}`}>
                                        أجب
                                    </button>
                                </div>

                            </div>
                        )
                        }
                        {status === Status.correct && (
                            <div className="bg-green-200  w-full  p-4">
                                <div className="max-w-[1140px] mx-auto flex justify-between">
                                    <button
                                        onClick={nextQuestion}
                                        className={`py-4 px-8 font-bold rounded-md text-center my-2 cursor-pointer bg-green-600 text-white`}>
                                        أكمل
                                    </button>
                                    <i className="ri-check-line w-16 h-16 items-center justify-center text-4xl rounded-full font-bold flex bg-white text-green-900"></i>

                                </div>

                            </div>
                        )
                        }

                        {status === Status.wrong && (
                            <div className="bg-red-200 w-full p-4">
                                <div className="max-w-[1140px] mx-auto flex justify-between">
                                    <button
                                        onClick={nextQuestion}
                                        className={`py-4 px-8 font-bold rounded-md text-center my-2 cursor-pointer bg-red-600 text-white`}>
                                        أكمل
                                    </button>
                                    <i className="ri-close-line w-16 h-16 items-center justify-center text-4xl rounded-full font-bold flex bg-white text-red-900"></i>

                                </div>

                            </div>
                        )
                        }
                    </>
                )
            }


        </section>
    );
};

export default LessonPage;
