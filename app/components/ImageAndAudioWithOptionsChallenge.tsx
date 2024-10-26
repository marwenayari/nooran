import {Challenge} from "~/models/Challenge";
import {ChallengeOption} from "~/models/ChallengeOption";

interface Props {
    challenge: Challenge,
    currentOptionId: number | null,
    opOptionClick: (option: ChallengeOption) => void
}

export default function ImageAndAudioWithOptionsChallenge({challenge, opOptionClick, currentOptionId}: Readonly<Props>): JSX.Element {
    return (
        <>
            <h3 className="font-bold text-xl mb-4">{challenge.question}</h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="relative">

                        <button className="ri-volume-up-line text-2xl cursor-pointer absolute top-2 right-2 bg-gray-100 p-2 rounded-md" onClick={() => {
                            const audio = new Audio(challenge.audio);
                            audio.play();
                        }}>
                            < i
                                ></i>
                        </button>

                        <img className="rounded-xl aspect-square max-h-[270px] border-2" width="100%"
                             src={challenge.imageSource} alt=""/>
                </div>
                <div className="flex flex-col my-4">
                    {
                        challenge.options.map(option => (
                            <button onClick={() => opOptionClick(option)} key={option.id}
                                    className={`inline-block p-4 rounded-md border-2 border-b-4 text-center font-bold my-2 cursor-pointer ${currentOptionId === option.id ? 'bg-green-400 bg-opacity-20 text-green-500 border-green-500' : 'bg-transparent text-gray-600'}`}>{option.text}</button>
                        ))
                    }
                </div>
            </div>
        </>
    )
}