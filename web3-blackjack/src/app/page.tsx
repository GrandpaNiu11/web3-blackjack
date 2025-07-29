'use client'

import {useEffect, useState} from "react";

function Page() {
    const ranks = ["A" ,"2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "J" , "Q" , "K"]
    const suits = ["♥️" , "♠️" , "♣️" , "♦️"]
    const cards = ranks.map(rank => suits.map(suit => ({ rank, suit }))).flat()
    const [deck, setDeck] = useState< { rank: string, suit: string }[]>([])
    useEffect(()=>{
        setDeck(cards)
    },[cards])


    return (<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl bold">Welcome to Web3 game Balck jak</h1>
        <h2 className="text-2xl"> Message: Player wins /dealer wins :BlackJack /bust</h2>
        <div className="mt-4">
            <h2 >Dealers hand</h2>

            <div className="flex  flex-row gap-2  ">
                {deck.slice(0,3).map((card, index) => (
                    <div key={index} className="w-32 h-42 bg-amber-300 border-black  rounded-md border-1 flex  justify-between flex-col">
                            <p className="text-2xl self-start p-2" >{card.rank}</p>
                            <p className="text-2xl self-center p-2">{card.suit}</p>
                            <p className="text-2xl self-end p-2">{card.rank}</p>
                    </div>
                ))}

            </div>
        </div>
        <div>
            <h2>player hand</h2>
            <div className="flex  flex-row gap-2  ">
                <div className="w-32 h-42 bg-amber-300 border-black  rounded-md border-1"></div>
                <div className="w-32 h-42 bg-amber-300 border-black  rounded-md border-1"></div>
                <div className="w-32 h-42 bg-amber-300 border-black  rounded-md border-1"></div>
            </div>
        </div>

        <div className="flex  flex-row gap-2  mt-4">
            <button className="bg-amber-300 rounded-md p-2" >Deal</button>
            <button className="bg-amber-300 rounded-md p-2" >Hit</button>
            <button className="bg-amber-300 rounded-md p-2" >Stand</button>
        </div>


    </div>)
}

export default Page