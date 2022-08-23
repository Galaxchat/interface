import { Trans } from "@lingui/macro";
import { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AutoColumn } from "../../components/Column";
import { AutoRow } from "../../components/Row";
import { Wrapper } from "../../components/swap/styleds";
import AppBody from "../AppBody";
import { useChatContract, useLaunchPadContract } from '../../hooks/useGalaxChat'
import ChatSend from "components/chat/ChatSend";
import ChatContent from "components/chat/ChatContent";
import ChatSearch from "components/chat/ChatSearch";
import { Separator } from "../../components/chat/styleds";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import ChatProgress from "components/chat/ChatProgress";
import ChatRoomNameBar from "components/chat/ChatRoomNameBar";
import ChatPrice from "components/chat/ChatPrice";


export default function Chat({ history }: RouteComponentProps) {
  const [chatRoomInfo, setChatRoomeInfo] = useState<any>({ name: undefined, imageURL: undefined, address: undefined })
  const chatUniSendContract = useChatContract()
  const chatLaunchPadContract = useLaunchPadContract()
  const { account } = useActiveWeb3React()
  const [percentage, setPercentage] = useState<any>()

  const changeRoomInfo = (data: any) => {
    setChatRoomeInfo(data)
  }

  const changePercentage = (percentage: any) => {
    setPercentage(percentage)
  }

  const updateRoomInfo = useCallback(async () => {
    if (chatLaunchPadContract && account && chatRoomInfo?.address) {
      const chatroomStatus = await chatLaunchPadContract.chatroomStatus(chatRoomInfo?.address);
      let tempRoomInfo = { ...chatRoomInfo }
      if (chatroomStatus.token != "0x0000000000000000000000000000000000000000" && chatRoomInfo.token != chatroomStatus.token) {
        tempRoomInfo.token = chatroomStatus.token
        tempRoomInfo.pair = chatroomStatus.pair
        changeRoomInfo(tempRoomInfo)
      }
    }
  }, [account, chatRoomInfo, chatLaunchPadContract])

  useEffect(() => {
    updateRoomInfo()
  }, [account, chatRoomInfo, chatLaunchPadContract])

  return (
    <>
      {console.log("Chat chatRoomInfo:", chatRoomInfo)}
      <ChatSearch
        chatContract={chatUniSendContract}
        account={account}
        changeRoomInfo={changeRoomInfo}
      />
      <AppBody>
        <Wrapper
          style={{
            padding: "26px",
            borderRadius: "16px",
          }}
        >
          <AutoColumn gap={"md"}>
            <Separator />
            {chatRoomInfo?.token ?
              <AutoRow justify="center" style={{}}>
                <ChatPrice
                  lpContract={chatLaunchPadContract}
                  account={account}
                  chatRoomInfo={chatRoomInfo ? chatRoomInfo : undefined}
                />
              </AutoRow>
              :
              <AutoRow justify="center" style={{}}>
                <ChatProgress
                  contract={chatLaunchPadContract}
                  account={account}
                  chatRoomInfo={chatRoomInfo ? chatRoomInfo : undefined}
                  changePercentage={changePercentage}
                  changeRoomInfo={changeRoomInfo}
                />
              </AutoRow>
            }
            <Separator />
            <AutoRow justify="space-between" style={{}}>
              <ChatRoomNameBar
                contract={chatLaunchPadContract}
                account={account}
                chatRoomInfo={chatRoomInfo ? chatRoomInfo : undefined}
                percentage={percentage}
                changeRoomInfo={changeRoomInfo}
              />
            </AutoRow>
            <Separator />
            <AutoRow justify="center" style={{ minHeight: "200px" }}>
              <ChatContent
                chatContract={chatUniSendContract}
                account={account}
                enterQuery={chatRoomInfo ? chatRoomInfo.address : undefined}
              />
            </AutoRow>
            <Separator style={{}} />
            <AutoRow justify="right" style={{ paddingBottom: '5px' }}>
              <ChatSend
                chatContract={chatUniSendContract}
                chatRoomAddress={chatRoomInfo ? chatRoomInfo.address : undefined}
                account={account}
              />
            </AutoRow>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  );
}
