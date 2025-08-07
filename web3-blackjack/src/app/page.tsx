'use client'

import {useEffect, useState} from "react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useConnect, useSignMessage, useWriteContract} from "wagmi";
import ABI from  "./abi.json"
import {injected} from "wagmi/connectors";

function Page() {
    const [message, setMessage] = useState<String>("")
    const [playerHand, setPlayerHand] = useState<{ rank: string, suit: string }[]>([])
    const [dealeHand, setDealeHand] = useState<{ rank: string, suit: string }[]>([])
    const [score, setScore] = useState<number | undefined>()
    const [isSigned, setIsSigned] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    let {address, isConnected} = useAccount();
    const {signMessageAsync} = useSignMessage();
    const {connect} = useConnect()
    const {writeContract, isPending} = useWriteContract()

    async function handhit() {
        setIsLoading(true);
        try {
            const response = await fetch("/api", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt") || ""}`
                },
                body: JSON.stringify({
                    action: "hit",
                    address
                })
            });
            const data = await response.json();
            setPlayerHand(data.playerHand)
            setDealeHand(data.dealerHand)
            setMessage(data.message);
            setScore(data.score);
        } finally {
            setIsLoading(false);
        }
    }

    async function handstand() {
        setIsLoading(true);
        try {
            const response = await fetch("/api", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt") || ""}`
                },
                body: JSON.stringify({
                    action: "stand",
                    address
                })
            });
            const data = await response.json();
            setPlayerHand(data.playerHand)
            setDealeHand(data.dealerHand)
            setMessage(data.message);
            setScore(data.score);
        } finally {
            setIsLoading(false);
        }
    }

    async function handrest() {
        setIsLoading(true);
        try {
            const response = await fetch(`/api?address=${address}`);
            const data = await response.json();
            setPlayerHand(data.playerHand)
            setDealeHand(data.dealerHand)
            setMessage(data.message);
            setScore(data.score);
        } finally {
            setIsLoading(false);
        }
    }

    const initGame = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api?address=${address}`);
            const data = await response.json();
            setPlayerHand(data.playerHand)
            setDealeHand(data.dealerHand)
            setMessage(data.message);
            setScore(data.score);
        } finally {
            setIsLoading(false);
        }
    }

    async function hanleSign() {
        setIsLoading(true);
        try {
            const message = `Welcome to the game black jack at ${new Date().toString()}`
            const signature = await signMessageAsync({message});
            const response = await fetch("/api", {
                method: "POST",
                body: JSON.stringify({
                    action: "auth",
                    address,
                    message,
                    signature
                })
            });
            if (response.status === 200) {
                setIsSigned(true)
                const {jsonwebToken} = await response.json();
                localStorage.setItem("jwt", jsonwebToken)
                await initGame();
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSendTs() {
        setIsLoading(true);
        try {
            const accounts = await window.ethereum.request({method: 'eth_accounts'})
            if (accounts.length === 0) {
                await window.ethereum.request({method: 'eth_requestAccounts'})
            }

            if (score && score < 1000) {
                return alert("Your score is less than 1000");
            }

            const hash = await writeContract({
                address: process.env.NEXT_PUBLIC_Address,
                abi: ABI,
                functionName: 'safeMint',
                args: [address],
            })

            const response = await fetch("/api", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt") || ""}`
                },
                body: JSON.stringify({
                    action: "clearall",
                    address,
                })
            });
            handrest()
        } finally {
            setIsLoading(false);
        }
    }

    if (!isSigned) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-900 to-green-700 p-4">
                <div className="bg-white bg-opacity-90 rounded-xl p-8 shadow-2xl max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold text-green-800 mb-6">Welcome to Web3 Blackjack</h1>
                    <div className="mb-6">
                        <ConnectButton/>
                    </div>
                    <button
                        onClick={hanleSign}
                        disabled={isLoading}
                        className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-200 
                        ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 active:scale-95'} 
                        text-white shadow-md`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing...
                            </span>
                        ) : "Sign with your wallet"}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Web3 Blackjack</h1>
                    <ConnectButton/>
                </div>

                <div className={`text-center mb-6 p-4 rounded-lg ${message === "You win" ? "bg-green-500" : "bg-amber-500"} transition-all duration-300`}>
                    <h2 className="text-2xl font-bold text-white">
                        Score: {score}
                        {message && <span className="ml-2">{message}</span>}
                    </h2>
                </div>

                {score !== undefined && score >= 1000 && (
                    <div className="text-center mb-6">
                        <button
                            onClick={handleSendTs}
                            disabled={isPending || isLoading}
                            className={`py-3 px-6 rounded-lg font-bold text-lg transition-all duration-200 
                            ${isPending || isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 active:scale-95'} 
                            text-white shadow-md`}
                        >
                            {isPending || isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : "Claim Your NFT (1000+ Score)"}
                        </button>
                    </div>
                )}

                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Dealer's Hand</h2>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {dealeHand.map((card, index) => (
                            <div key={index}
                                 className={`w-20 h-28 md:w-24 md:h-32 ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'} 
                                 bg-white rounded-md border-2 border-gray-300 flex flex-col justify-between items-center 
                                 shadow-lg transform hover:scale-105 transition-transform`}>
                                <p className="self-start text-lg font-bold pl-2 pt-1">{card.rank}</p>
                                <p className="text-3xl font-bold">{card.suit}</p>
                                <p className="self-end text-lg font-bold pr-2 pb-1 rotate-180">{card.rank}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Hand</h2>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {playerHand.map((card, index) => (
                            <div key={index}
                                 className={`w-20 h-28 md:w-24 md:h-32 ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'} 
                                 bg-white rounded-md border-2 border-gray-300 flex flex-col justify-between items-center 
                                 shadow-lg transform hover:scale-105 transition-transform`}>
                                <p className="self-start text-lg font-bold pl-2 pt-1">{card.rank}</p>
                                <p className="text-3xl font-bold">{card.suit}</p>
                                <p className="self-end text-lg font-bold pr-2 pb-1 rotate-180">{card.rank}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-6">
                    {message === "" ? (
                        <>
                            <button
                                onClick={handhit}
                                disabled={isLoading}
                                className={`py-3 px-6 rounded-lg font-bold text-lg transition-all duration-200 
                                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'} 
                                text-white shadow-md min-w-32`}
                            >
                                {isLoading ? "..." : "Hit"}
                            </button>
                            <button
                                onClick={handstand}
                                disabled={isLoading}
                                className={`py-3 px-6 rounded-lg font-bold text-lg transition-all duration-200 
                                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:scale-95'} 
                                text-white shadow-md min-w-32`}
                            >
                                {isLoading ? "..." : "Stand"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handrest}
                            disabled={isLoading}
                            className={`py-3 px-6 rounded-lg font-bold text-lg transition-all duration-200 
                            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 active:scale-95'} 
                            text-white shadow-md min-w-32`}
                        >
                            {isLoading ? "..." : "Play Again"}
                        </button>
                    )}
                </div>

                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl flex items-center">
                            <svg className="animate-spin h-8 w-8 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-lg font-semibold">Processing your move...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page