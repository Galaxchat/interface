import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components/macro";
import "react-chat-elements/dist/main.css";
import './style.css';
import { BigNumber } from 'ethers'



export default function ChatProgress(props: any) {
  const [currentFund, setCurrentFund] = useState<any>()
  const [minFund, setMinFund] = useState<any>()
  const { contract, account, chatRoomAddress } = props


  const changeProgress = useCallback(() => {
    const percentage = (currentFund / minFund * 100).toString()
    const element = document.querySelector(".g-progress") as HTMLElement
    if (element && percentage){
      // element.style.setProperty("--progress", percentage)
      element.style.setProperty("background", `linear-gradient(90deg, #0f0, #fb7962 ${percentage}%, transparent 0)`)
    }
  }, [currentFund, minFund])


  useEffect(() => {
    const getProgress = async () => {
      if (contract && account && chatRoomAddress) {
        const chatroomStatus = await contract.chatroomStatus(chatRoomAddress)
        // setCurrentFund(parseFloat(chatroomStatus.totalFund.toString()) / 100000000000000000)
        setCurrentFund(0.21)

        const getMinFund = await contract.minETHAmount()
        setMinFund(parseFloat(getMinFund.toString()) / 100000000000000000)
      }
    }
    getProgress()
    changeProgress()
  }, [contract, account, chatRoomAddress, currentFund, minFund])

  return (
    <>
      <div className="g-progress">
        {currentFund} ETH / {minFund} ETH
      </div>
    </>
  )
}

