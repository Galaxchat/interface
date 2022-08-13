import { useEffect, useMemo, useState } from "react";
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
`;


export default function ChatContent(props: any) {
  const [contentList, setContentList] = useState<any>([])

  const { chatContract, account, enterQuery } = props


  function getTime(timestamp: any) {
    const d = new Date(parseInt(timestamp.toString() + '000'))
    const year = d.getFullYear().toString()
    let month = (d.getMonth() + 1).toString().length < 2 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString()
    let day = d.getDate().toString().length < 2 ? "0" + d.getDate().toString() : d.getDate().toString()
    let hour = (d.getHours() - 8).toString().length < 2 ? "0" + (d.getHours() - 8).toString() : (d.getHours() - 8).toString()
    let minute = d.getMinutes().toString().length < 2 ? "0" + d.getMinutes().toString() : d.getMinutes().toString()
    let second = d.getSeconds().toString().length < 2 ? "0" + d.getSeconds().toString() : d.getSeconds().toString()
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  // const dataMemo = useMemo(() => {
  //   if (enterQuery && chatContract && account) {
  //     // setContentList(testData)
  //     const eventFilter = chatContract.filters.Send(enterQuery)
  //     chatContract.on(eventFilter, (_chatroom:any,_sender: any, _content: any, timestamp: any) => {
  //       console.log("on eventFilter",_sender,_content)
  //       contentListTemp.push(
  //         {
  //           args:{
  //             _sender: _sender,
  //             _content: _content,
  //             timestamp: timestamp,
  //           }
  //         }
  //       )
  //       console.log("contentListTemp", contentListTemp)
  //     })
  //     return contentListTemp
  //   } else {
  //     return contentList
  //   }
  // }, [])


  useEffect(() => {
    if (enterQuery && chatContract && account) {
      const eventFilter = chatContract.filters.Send(enterQuery)

      chatContract.queryFilter(eventFilter)
        .then((dataList: any) => {
          // contentListTemp = [...dataList]
          setContentList(dataList)
          let contentListTemp = [...dataList]
          chatContract.on(eventFilter, (_chatroom: string, _sender: string, _content: string, timestamp: BigNumber, blockHash: string) => {
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
      if (chatContract){
        chatContract.removeAllListeners('Send', () => {
          console.log("Unsubscribe Send listeners ")
        })
      }
    }
  }, [enterQuery, account, chatContract]);

  return (
    <ChatRoom>
      {contentList.length != 0 ? contentList.map((data: any, index: number) => {
        const time = getTime(data.args.timestamp.toString())
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
                  <span>{data.args._content}</span>
                </div>
              </div>
            </div>
            <br />
          </div>
        )
      }) :
        <div style={{ textAlign: "center" }}>
          <svg viewBox="0 0 79 86" width="160px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="linearGradient-1-1" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%"><stop stopColor="#FCFCFD" offset="0%"></stop><stop stopColor="#EEEFF3" offset="100%"></stop></linearGradient><linearGradient id="linearGradient-2-1" x1="0%" y1="9.5%" x2="100%" y2="90.5%"><stop stopColor="#FCFCFD" offset="0%"></stop><stop stopColor="#E9EBEF" offset="100%"></stop></linearGradient><rect id="path-3-1" x="0" y="0" width="17" height="36"></rect></defs><g id="Illustrations" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="B-type" transform="translate(-1268.000000, -535.000000)"><g id="Group-2" transform="translate(1268.000000, 535.000000)"><path id="Oval-Copy-2" d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z" fill="#F7F8FC"></path><polygon id="Rectangle-Copy-14" fill="#E5E7E9" transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) " points="13 58 53 58 42 45 2 45"></polygon><g id="Group-Copy" transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)"><polygon id="Rectangle-Copy-10" fill="#E5E7E9" transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) " points="2.84078316e-14 3 18 3 23 7 5 7"></polygon><polygon id="Rectangle-Copy-11" fill="#EDEEF2" points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon><rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-1)" transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) " x="38" y="7" width="17" height="36"></rect><polygon id="Rectangle-Copy-13" fill="#F8F9FB" transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) " points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon></g><rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-1)" x="13" y="45" width="40" height="36"></rect><g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)"><mask id="mask-4-1" fill="white"><use xlinkHref="#path-3-1"></use></mask><use id="Mask" fill="#E0E3E9" transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) " xlinkHref="#path-3-1"></use><polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-1)" transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) " points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon></g><polygon id="Rectangle-Copy-18" fill="#F8F9FB" transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) " points="62 45 79 45 70 58 53 58"></polygon></g></g></g></svg>
        </div>
      }
    </ChatRoom>
  )
}

