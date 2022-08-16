import { useCallback, useEffect, useState } from "react";
import styled from "styled-components/macro";
import "react-chat-elements/dist/main.css";
import './style.css';
import ChatUserInfo from "./ChatUserInfo";
import { BigNumber } from 'ethers'

const ChatRoom = styled.div`
  width: 100%;
  padding: 16px;
  overflow: auto;
  min-height: 200px
  max-height: 400px;
  height: 400px;
  // display: flex;

::-webkit-scrollbar-thumb:horizontal { 
    width: 4px;
    background-color: #CCCCCC;
    -webkit-border-radius: 6px;
}
::-webkit-scrollbar-track-piece {
    background-color: #fff; 
    -webkit-border-radius: 0; 
}
::-webkit-scrollbar {
    width: 10px; 
    height: 8px; 
}
::-webkit-scrollbar-thumb:vertical { 
    height: 50px;
    background-color: #999;
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
}
::-webkit-scrollbar-thumb:hover { 
    height: 50px;
    background-color: #9f9f9f;
    -webkit-border-radius: 4px;
}
`;


export default function ChatContent(props: any) {
  const [contentList, setContentList] = useState<any>([])
  const { chatContract, account, enterQuery } = props

  const getTimeCall = useCallback((timestamp:any)=>{    
    const d = new Date(parseInt(timestamp.toString() + '000'))
    const year = d.getFullYear().toString()
    let month = (d.getMonth() + 1).toString().length < 2 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString()
    let day = d.getDate().toString().length < 2 ? "0" + d.getDate().toString() : d.getDate().toString()
    let hour = (d.getHours() - 8).toString().length < 2 ? "0" + (d.getHours() - 8).toString() : (d.getHours() - 8).toString()
    let minute = d.getMinutes().toString().length < 2 ? "0" + d.getMinutes().toString() : d.getMinutes().toString()
    let second = d.getSeconds().toString().length < 2 ? "0" + d.getSeconds().toString() : d.getSeconds().toString()
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`

  },[])

  useEffect(() => {
    if (enterQuery && chatContract && account) {
      const eventFilter = chatContract.filters.Send(enterQuery)

      chatContract.queryFilter(eventFilter)
        .then((dataList: any) => {
          // contentListTemp = [...dataList]
          setContentList(dataList)
          let contentListTemp = [...dataList]
          chatContract.on(eventFilter, (_chatroom: string, _sender: string, _content: string, id: BigNumber,timestamp: BigNumber, blockHash: string) => {
            contentListTemp.push(
              {
                args: {
                  _sender: _sender,
                  _content: _content,
                  timestamp: timestamp,
                },
                blockHash: blockHash
              }
            )

            // distinct data
            let distinctContenList = []
            let obj = {}
            for (let content of contentListTemp) {
              if (!obj[content.blockHash]) {
                distinctContenList.push(content)
                obj[content.blockHash] = 1
              }
            }
            setContentList(distinctContenList)
          })
        })
        .catch((e: Error) => {
          console.log(e);
        })

    }
    return () => {
      if (chatContract) {
        chatContract.removeAllListeners('Send', () => {
          console.log("Unsubscribe Send listeners ")
        })
      }
    }
  }, [enterQuery, account, chatContract]);

  return (
    <ChatRoom>
      {contentList.length !== 0 ? contentList.map((data: any, index: number) => {
        const time = getTimeCall(data.args.timestamp.toString())
        return (
          <div key={data + index}>
            <div className="d-flex align-items-end">
              <ChatUserInfo
                address={data.args._sender}
                type='avatar'
              />
              <div className="d-flex flex-column gap-1" style={{ marginLeft: "6px" }}>
                <div className="chat-ui-bubble">
                  <div className="small text-muted me-2">
                    <ChatUserInfo
                      address={data.args._sender}
                      type='name'
                    />
                    <span>on {time} +UTC</span>

                  </div>
                  <span className="text-muted" style={{ whiteSpace: 'pre-line' }}>{data.args._content}</span>
                </div>
              </div>
            </div>
            <br />
          </div>
        )
      }) :
        <div style={{ textAlign: "center" }}>
            <span className="text-muted"> There are nothing.</span>
        </div>
      }
    </ChatRoom>
  )
}

