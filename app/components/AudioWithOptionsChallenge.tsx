import {Challenge} from "~/models/Challenge";
import {ChallengeOption} from "~/models/ChallengeOption";

interface Props {
    challenge: Challenge,
    currentOptionId: number | null,
    opOptionClick: (option: ChallengeOption) => void
}

export default function AudioWithOptionsChallenge({challenge, opOptionClick, currentOptionId}: Readonly<Props>): JSX.Element {
    return (
        <>
            <h3 className="font-bold text-xl mb-4">{challenge.question}</h3>
            <div className="grid grid-cols-3 gap-3">
                <div>

                        <button className="block w-full h-[150px] ri-volume-up-line text-2xl cursor-pointer bg-gray-100 p-2 rounded-xl" onClick={() => {
                            const audio = new Audio(challenge.audio);
                            audio.play();
                        }}>
                        </button>
                </div>
                <div className="flex gap-3 col-span-2">
                    {
                        challenge.options.map(option => (
                            <button onClick={() => opOptionClick(option)} key={option.id}
                                    className={`inline-block flex-1 p-4 rounded-md border-2 border-b-4 text-center font-bold my-2 cursor-pointer ${currentOptionId === option.id ? 'bg-green-400 bg-opacity-20 text-green-500 border-green-500' : 'bg-transparent text-gray-600'}`}>{option.text}</button>
                        ))
                    }
                </div>
            </div>
        </>
    )
}