import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import "react-chat-elements/dist/main.css";
import './style.css';
import ChatUserInfo from "./ChatUserInfo";

const ChatRoom = styled.div`
  // max-width: 460px;
  width: 100%;
  height: 400px;
  padding: 16px;
  overflow: auto;
`;


export default function ChatContent(props: any) {
  const [contentList, setContentList] = useState<any>([])

  const { chatContract, account, enterQuery } = props
  // const { avatar } = useENSAvatar("0x121")
  // const ENSName = useENSName("0x121B").ENSName
  // console.log("avatar ", avatar)
  // console.log("ENSName ", ENSName)
  // const testData = [
  //   {
  //     id: 0,
  //     address: "0x121Bc38Cd4eB944bD2783da6973e4A3C814c75A0",
  //     content: 'hello 0',
  //     time: 'Mon 08:17 PM'
  //   },
  //   {
  //     id: 1,
  //     address: "0x8b67760994786F7cdD6BE07A716504471D182D50",
  //     content: 'hello 1',
  //     time: 'Mon 08:17 PM'
  //   },
  //   {
  //     id: 2,
  //     address: "0xe37eBE5884017C3dfbB9187E70976280Ea4202e0",
  //     content: 'hello 3',
  //     time: 'Mon 08:17 PM'
  //   }

  // ]

  useEffect(() => {
    let contentListTemp = [...contentList]
    if (enterQuery && chatContract && account) {
      // setContentList(testData)
      chatContract.on("Send", (chatroom: any, sender: any, content: any, id: any, block: any, timestamp: any) => {
        if (enterQuery === chatroom) {
          contentListTemp.push(
            {
              address: sender,
              content: content,
              time: 'Mon 08:17 PM'
            }
          )
          setContentList(contentListTemp)
        }
      })
    }
    // return () => {
    //   chatContract.off("Send",()=>{
    //     console.log("off send event")
    //   })
    // }
  }, [enterQuery, contentList, account ,chatContract]);

  console.log("contentList:", contentList)

  return (
    <ChatRoom>
      {contentList.map((data: any, index: number) => {
        console.log("data:", data)
        return (
          <div key={data + index}>
            <div className="d-flex align-items-end">
              <ChatUserInfo
                address={data.address}
                type='avatar'
              />
              <div className="d-flex flex-column gap-1">
                <div className="chat-ui-bubble">
                  <div className="small text-muted me-2">
                    <ChatUserInfo
                      address={data.address}
                      type='name'
                    />
                    <span>on {data.time}</span>

                  </div>
                  <span>{data.content}</span>
                </div>
              </div>
            </div>
            <br />
          </div>
        )
      })}
    </ChatRoom>
  )
}

