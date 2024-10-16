import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData, useNavigate} from "@remix-run/react";
import {useState} from "react";

const currentCourse = {
    id: 1
}
const questions = [
    {
        id: 1,
        text: "ماهي سرعة الفهد؟",
        options: [
            {
                id: 1,
                text: "25كم في الساعة",
            },
            {
                id: 2,
                text: "40كم في الساعة",
            },
            {
                id: 3,
                text: "لا أعلم",
            }
        ],
        correctAnswer: 3
    },
    {
        id: 1,
        text: "ماهو أعلى مدى يطير فيه النسر",
        options: [
            {
                id: 1,
                text: "11كم",
            },
            {
                id: 2,
                text: "13كم",
            },
            {
                id: 3,
                text: "لا أعلم",
            }
        ],
        correctAnswer: 3
    }
];

export const loader = async ({params}: LoaderFunctionArgs) => {
    return json(questions);
};

enum Status {
    question = "QUESTION",
    correct = "CORRECT",
    wrong = "WRONG"
}

const LessonPage = () => {
    const navigate = useNavigate();
    const questions = useLoaderData<typeof loader>();
    const [currentQuestion, setCurrentQuestion] = useState(questions[0])
    const [currentAnswer, setCurrentAnswer] = useState<number | null>(null)
    const [status, setStatus] = useState<Status>(Status.question)

    const answer = () => {
        if (currentAnswer === currentQuestion.correctAnswer) {
            setStatus(Status.correct)
        } else {
            setStatus(Status.wrong)
        }
    }
    const nextQuestion = () => {
        const currentQuestionIndex = questions.indexOf(currentQuestion);
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestion(questions[currentQuestionIndex + 1])
            setStatus(Status.question)
            setCurrentAnswer(null)
        } else {
            navigate(`/courses/${currentCourse.id}`)
        }
    }

    return (
        <section className="w-screen h-screen flex flex-col items-center pt-10">
            <div
                className="pb-3 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
                <i onClick={() => {navigate(`/courses/${currentCourse.id}`)}} className="text-3xl text-slate-500 hover:opacity-75 transition cursor-pointer ri-close-large-line"></i>
                <div className="w-full bg-gray-200 rounded-full h-3.5  dark:bg-gray-700">
                    <div className="bg-green-400 h-3.5 rounded-full" style={{width: "45%"}}></div>
                </div>
                <div className="flex items-center font-bold">
                    <i className="ri-heart-fill text-3xl text-red-500"></i>
                </div>
            </div>
            <div className="py-8 w-full flex flex-grow max-w-[768px] mx-auto items-center">
                <div className="block w-full">
                    <h3 className="font-bold text-xl text-right">{currentQuestion.text}</h3>
                    <div className="text-right flex flex-col my-4">
                        {
                            currentQuestion.options.map(option => (
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

        </section>
    );
};

export default LessonPage;
