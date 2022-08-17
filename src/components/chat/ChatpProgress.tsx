import { useCallback, useEffect, useState } from "react";
import styled from "styled-components/macro";
import "react-chat-elements/dist/main.css";
import './style.css';
import { BigNumber } from 'ethers'



export default function ChatProgress(props: any) {
  const { contract, account, chatRoomAddress } = props
  console.log(contract)

  useEffect(() => {
    if (contract && account && chatRoomAddress) {
      const currentFund = contract.chatroomStatus(chatRoomAddress)
      console.log("currentFund:", currentFund)
    }
  }, [contract, account, chatRoomAddress])

  return (
    <>
      <div className="progress-bar">
        <div className="progress-bg">
        </div>
        0.1ETH / 1 ETH
      </div>
    </>
  )
}

