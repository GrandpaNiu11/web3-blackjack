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
    const [score, setScore] = useState()
    const [isSigned, setIsSigned] = useState<boolean>(false)
    let {address,isConnected} = useAccount();
    const {signMessageAsync} = useSignMessage();
    const { connect } = useConnect()
    const { writeContract, isPending } = useWriteContract()


    async function handhit() {
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

    }

    async function handstand() {
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
    }

    async function handrest() {
        const response = await fetch(`/api?address=${address}`);
        const data = await response.json();
        setPlayerHand(data.playerHand)
        setDealeHand(data.dealerHand)
        setMessage(data.message);
        setScore(data.score);
    }


    const initGame = async () => {
        const response = await fetch(`/api?address=${address}`);
        const data = await response.json();
        setPlayerHand(data.playerHand)
        setDealeHand(data.dealerHand)
        setMessage(data.message);
        setScore(data.score);
    }

    async function hanleSign(){
        const message =`Welcome to the game black jack at ${new Date().toString()}`
        const signature = await  signMessageAsync({message});
        console.log("signature",signature)
        const response = await fetch("/api", {
            method: "POST",
            body: JSON.stringify({
                action: "auth",
                address,
                message,
                signature
            })
        });
        if (response.status===200){
            setIsSigned(true)
            console.log("验证成功")
            const {jsonwebToken} = await response.json();
            localStorage.setItem("jwt",jsonwebToken)
            // 初始化
            initGame();
        }
    }
    // 发送nft
    async function handleSendTs(){
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length === 0) {
            // 弹窗请求授权
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        }

        // await connect({ connector: injected() })
        if (score<1000){
            return  alert("Your score is less than 1000") ;
        }
        console.log("11",ABI)
        // console.log(ABI)
        console.log('当前地址:', address, '已连接:', isConnected)

        const hash =    await  writeContract({
                address: process.env.NEXT_PUBLIC_Address,
                abi: ABI, // 你的合约ABI
                functionName: 'safeMint',
                args: [address], // 参数数组）
            })
        console.log('交易哈希:', hash) // 调试3：确认交易发送

        // 在清空分数
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
    }


    if (!isSigned){
       return ( <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
           <ConnectButton  />
           <button  onClick={hanleSign} className="bg-amber-300 rounded-md p-2 m-2">Sign with your wallet       </button>
       </div>
    )
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <ConnectButton  />
            <h1 className="text-3xl bold">Welcome to Web3 game Balck jak(1000 score to get NFT)</h1>
        <h2 className={`text-2xl ${message === "You win" ? "bg-green-400" : "bg-amber-300"}`}>score :{score} {message}</h2>
            { score >= 1000 &&(      <button  onClick={handleSendTs} className="bg-amber-300 rounded-md p-2">get NFT</button>)
            }
            {      isPending ? '铸造中...' : '铸造 NFT'}

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