'use client'

import {useEffect, useState} from "react";
import {suite} from "node:test";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount} from "wagmi";

function Page() {
    const [message, setMessage] = useState<String>("")
    const [playerHand, setPlayerHand] = useState<{ rank: string, suit: string }[]>([])
    const [dealeHand, setDealeHand] = useState<{ rank: string, suit: string }[]>([])
    const [score, setScore] = useState()
   let {address,isConnected} = useAccount();

    useEffect(() => {
        initGame();
        console.log( "address========",address)
        console.log( "isConnected========",isConnected)
    }, [])

    async function handhit() {
        const response = await fetch("/api", {
            method: "POST",
            body: JSON.stringify({
                action: "hit"
            })
        });
        const data = await response.json();
        setPlayerHand(data.playerHand)
        setDealeHand(data.dealerHand)
        setMessage(data.message);
        setScore(data.score);
    }

    async function handstand() {
        const response = await fetch("/api", {
            method: "POST",
            body: JSON.stringify({
                action: "stand"
            })
        });
        const data = await response.json();
        setPlayerHand(data.playerHand)
        setDealeHand(data.dealerHand)
        setMessage(data.message);
        setScore(data.score);
    }

    async function handrest() {
        const response = await fetch("/api");
        const data = await response.json();
        setPlayerHand(data.playerHand)
        setDealeHand(data.dealerHand)
        setMessage(data.message);
        setScore(data.score);
    }


    const initGame = async () => {
        const response = await fetch("/api");
        const data = await response.json();
        setPlayerHand(data.playerHand)
        setDealeHand(data.dealerHand)
        setMessage(data.message);
        setScore(data.score);
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <ConnectButton />
            <h1 className="text-3xl bold">Welcome to Web3 game Balck jak</h1>
        <h2 className={`text-2xl ${message === "You win" ? "bg-green-400" : "bg-amber-300"}`}>score :{score} {message}</h2>
        <div className="mt-4">
            <h2>Dealers hand</h2>

            <div className="flex  flex-row gap-2  ">
                {dealeHand.map((card, index) => (
                    <div key={index}
                         className="w-32 h-42 bg-amber-300 border-black  rounded-md border-1 flex  justify-between flex-col">
                        <p className="text-2xl self-start p-2 ">{card.rank}</p>
                        <p className="text-2xl self-center p-1">{card.suit}</p>
                        <p className="text-2xl self-end p-2 ">{card.rank}</p>
                    </div>
                ))}

            </div>
        </div>
        <div>
            <h2>player hand</h2>
            <div className="flex  flex-row gap-2  ">
                {playerHand.map((card, index) => (
                    <div key={index}
                         className="w-32 h-42 bg-amber-300 border-black  rounded-md border-1 flex  justify-between flex-col">
                        <p className="text-2xl self-start p-2 ">{card.rank}</p>
                        <p className="text-2xl self-center p-2">{card.suit}</p>
                        <p className="text-2xl self-end p-2 ">{card.rank}</p>
                    </div>
                ))}

            </div>
        </div>

        <div className="flex  flex-row gap-2  mt-4">
            {
                message === "" ? < >
                    <button onClick={handhit} className="bg-amber-300 rounded-md p-2">Hit</button>
                    <button onClick={handstand} className="bg-amber-300 rounded-md p-2">Stand</button>
                </>:   <button onClick={handrest} className="bg-amber-300 rounded-md p-2">reset</button>
            }


        </div>


    </div>)
}

export default Page