import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {useState} from "react";

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
    }
];

export const loader = async ({params}: LoaderFunctionArgs) => {
    return json(questions);
};

const Lessonpage = () => {
    const questions = useLoaderData<typeof loader>();
    const [currentQuestion, setCurrentQuestion] = useState(questions[0])
    const [currentAnswer, setCurrentAnswer] = useState<number | null>(null)

    return (
        <section className="flex flex-col items-center">
            <div
                className="pb-3 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full border-b">
                <i className="text-slate-500 hover:opacity-75 transition cursor-pointer ri-close-large-line"></i>
                <div className="w-full bg-gray-200 rounded-full h-2.5  dark:bg-gray-700">
                    <div className="bg-green-600 h-2.5 rounded-full dark:bg-green-500" style={{width: "45%"}}></div>
                </div>
                <div className="flex items-center font-bold">
                    <i className="ri-heart-fill  text-red-500"></i>
                </div>
            </div>
            <div className="py-8 block w-full flex-grow">
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
            <div className="border-t w-full text-right">
                <button
                    className={`inline-block py-4 px-8 font-bold rounded-md text-center my-2 cursor-pointer ${currentAnswer === null ? 'bg-gray-200 text-gray-600' : 'text-white bg-green-400'}`}>
                    أجب
                </button>

            </div>
        </section>
    );
};

export default Lessonpage;
