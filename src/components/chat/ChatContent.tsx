import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  KeyboardEvent,
  RefObject,
  useRef,
  createContext
} from "react";
import { AutoColumn } from "../../components/Column";
import { AutoRow } from "../../components/Row";
import { SearchInput, Separator } from "../../components/chat/styleds";
import Loader from "../../components/Loader";
import { t, Trans } from "@lingui/macro";
import { TransactionResponse } from "@ethersproject/abstract-provider"
import styled, { ThemeContext } from "styled-components/macro";
import Logo from "components/Logo";
import useENSAvatar from 'hooks/useENSAvatar'
import useENSName from 'hooks/useENSName'
import "react-chat-elements/dist/main.css";
import { ChatList } from 'react-chat-elements'
import './style.css';


const ChatRoom = styled.div`
  // max-width: 460px;
  width: 100%;
  height: 400px;
  padding: 16px
`;

const messageListReferance = React.createRef();

export default function ChatContent(props: any) {
  const [content, setContent] = useState<string>("");
  const [contentList, setContentList] = useState<any>([])

  const { chatContract, account, enterQuery } = props
  // const { avatar } = useENSAvatar("0x121")
  // const ENSName = useENSName("0x121B").ENSName
  // console.log("avatar ", avatar)
  // console.log("ENSName ", ENSName)
  const testData = [
    {
      id: 0,
      address: "0x8b67760994786F7cdD6BE07A716504471D182D50",
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA5NJREFUeF7tnbFNbDEQRf0kYrKVECUgoa0BiSaICYgpiJgyqGFFQAe0sYgWfCxdXfn8fOx5d87eGXsf+4+bt9N1gH/fn2cQPcbjywXF0/3R5iOfP9XvEACGAC0ABZjuLwCs/nEHEwDYgmD9BSBtYXR/AXAIRAxQC6YA0/2dAVD5PQWMNMF0f1h/ZwBaAGphdH8BcAZADKQBpvs7A6DyOwM4A4SvsnUAL4KQh9kCkHy2AFuALcCvg4mJ0GMsngF+bp/R+wDk4f9j6QNQAXfP/xAAhkA7wALA6l/vYAIgAM4AhAFbAFHPIRAfo6H8wxYAFdQBNhdQAAQAKZC+x7AFoPL1X2QJgAB4DCQMOAMQ9TwGegxs/wS15+8MsLmDCYAAdA+BsH7xcO8B4CtV8QrCBARAACBCLLx+BmCPn4/WAXSAKIU6QFT+4UUQvUgJ1w9vbwuwBWCIyAK2AKLeglgdQAdYgNH8EjrAvHZLInUAHWAJSLOL6ACzyi2K0wF0gEUozS2jA8zptixKB9ABlsE0sxB2AHqTl/4EzIi2MiatnwCsrObEWgIQ/pWviZotDREAAUBA0RZqC0Dy82AdQAdAFOkASL58sA6gAyAKdQAkXz5YB9ABEIU6AJIvH6wD6ACIQh0AyZcP1gF0AEShDoDkywfrADoAojDuACj7McbT6y9a4uvjHsXT4Pb88ZdBuwsoAJCAdgHb89cBNgdYAAQg+yNR7Rbanr8OoAPoAIQBHYCo5z3ASN9j2AI2B1gABMAZgDDgDEDUcwZwBmj/BLXn7wywuYMJwO4A3L0/XIkG9BybfiOGPPt/bDp/2oIOAWAICAB8IyctICu/DoCPMQJwRgzaAsIvlaYBFgABQA7iEIjkcwZwBoC/c0jf67cF2AKQh9kCkHy2AFuALYD9aVb6GAUNwKtgvwu4IIYcAsMWiqrnl0HDGSAMsMdAj4HIxPALIXSIQ9kbjP/rWQEoh4gOkQIgAOzvAmwBWYJ0gKz+8d0FIF6CbAICkNU/vrsAxEuQTUAAsvrHdxeAeAmyCQhAVv/47gIQL0E2AQHI6h/fXQDiJcgmIABZ/eO7C0C8BNkEMAA3byf0+wDZx3d3qsAhAFTC7ngB6K4fzl4AsITdCwhAd/1w9gKAJexeQAC664ezFwAsYfcCAtBdP5y9AGAJuxcQgO764ewFAEvYvYAAdNcPZy8AWMLuBQSgu344ewHAEnYv8AfVsZgumXzPzQAAAABJRU5ErkJggg==',
      content: 'hello 0'
    },
    {
      id: 1,
      address: "0x8b67760994786F7cdD6BE07A716504471D182D50",
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA5NJREFUeF7tnbFNbDEQRf0kYrKVECUgoa0BiSaICYgpiJgyqGFFQAe0sYgWfCxdXfn8fOx5d87eGXsf+4+bt9N1gH/fn2cQPcbjywXF0/3R5iOfP9XvEACGAC0ABZjuLwCs/nEHEwDYgmD9BSBtYXR/AXAIRAxQC6YA0/2dAVD5PQWMNMF0f1h/ZwBaAGphdH8BcAZADKQBpvs7A6DyOwM4A4SvsnUAL4KQh9kCkHy2AFuALcCvg4mJ0GMsngF+bp/R+wDk4f9j6QNQAXfP/xAAhkA7wALA6l/vYAIgAM4AhAFbAFHPIRAfo6H8wxYAFdQBNhdQAAQAKZC+x7AFoPL1X2QJgAB4DCQMOAMQ9TwGegxs/wS15+8MsLmDCYAAdA+BsH7xcO8B4CtV8QrCBARAACBCLLx+BmCPn4/WAXSAKIU6QFT+4UUQvUgJ1w9vbwuwBWCIyAK2AKLeglgdQAdYgNH8EjrAvHZLInUAHWAJSLOL6ACzyi2K0wF0gEUozS2jA8zptixKB9ABlsE0sxB2AHqTl/4EzIi2MiatnwCsrObEWgIQ/pWviZotDREAAUBA0RZqC0Dy82AdQAdAFOkASL58sA6gAyAKdQAkXz5YB9ABEIU6AJIvH6wD6ACIQh0AyZcP1gF0AEShDoDkywfrADoAojDuACj7McbT6y9a4uvjHsXT4Pb88ZdBuwsoAJCAdgHb89cBNgdYAAQg+yNR7Rbanr8OoAPoAIQBHYCo5z3ASN9j2AI2B1gABMAZgDDgDEDUcwZwBmj/BLXn7wywuYMJwO4A3L0/XIkG9BybfiOGPPt/bDp/2oIOAWAICAB8IyctICu/DoCPMQJwRgzaAsIvlaYBFgABQA7iEIjkcwZwBoC/c0jf67cF2AKQh9kCkHy2AFuALYD9aVb6GAUNwKtgvwu4IIYcAsMWiqrnl0HDGSAMsMdAj4HIxPALIXSIQ9kbjP/rWQEoh4gOkQIgAOzvAmwBWYJ0gKz+8d0FIF6CbAICkNU/vrsAxEuQTUAAsvrHdxeAeAmyCQhAVv/47gIQL0E2AQHI6h/fXQDiJcgmIABZ/eO7C0C8BNkEMAA3byf0+wDZx3d3qsAhAFTC7ngB6K4fzl4AsITdCwhAd/1w9gKAJexeQAC664ezFwAsYfcCAtBdP5y9AGAJuxcQgO764ewFAEvYvYAAdNcPZy8AWMLuBQSgu344ewHAEnYv8AfVsZgumXzPzQAAAABJRU5ErkJggg==',
      content: 'hello 1'
    },
    {
      id: 2,
      address: "0xe37eBE5884017C3dfbB9187E70976280Ea4202e0",
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA5NJREFUeF7tnbFNbDEQRf0kYrKVECUgoa0BiSaICYgpiJgyqGFFQAe0sYgWfCxdXfn8fOx5d87eGXsf+4+bt9N1gH/fn2cQPcbjywXF0/3R5iOfP9XvEACGAC0ABZjuLwCs/nEHEwDYgmD9BSBtYXR/AXAIRAxQC6YA0/2dAVD5PQWMNMF0f1h/ZwBaAGphdH8BcAZADKQBpvs7A6DyOwM4A4SvsnUAL4KQh9kCkHy2AFuALcCvg4mJ0GMsngF+bp/R+wDk4f9j6QNQAXfP/xAAhkA7wALA6l/vYAIgAM4AhAFbAFHPIRAfo6H8wxYAFdQBNhdQAAQAKZC+x7AFoPL1X2QJgAB4DCQMOAMQ9TwGegxs/wS15+8MsLmDCYAAdA+BsH7xcO8B4CtV8QrCBARAACBCLLx+BmCPn4/WAXSAKIU6QFT+4UUQvUgJ1w9vbwuwBWCIyAK2AKLeglgdQAdYgNH8EjrAvHZLInUAHWAJSLOL6ACzyi2K0wF0gEUozS2jA8zptixKB9ABlsE0sxB2AHqTl/4EzIi2MiatnwCsrObEWgIQ/pWviZotDREAAUBA0RZqC0Dy82AdQAdAFOkASL58sA6gAyAKdQAkXz5YB9ABEIU6AJIvH6wD6ACIQh0AyZcP1gF0AEShDoDkywfrADoAojDuACj7McbT6y9a4uvjHsXT4Pb88ZdBuwsoAJCAdgHb89cBNgdYAAQg+yNR7Rbanr8OoAPoAIQBHYCo5z3ASN9j2AI2B1gABMAZgDDgDEDUcwZwBmj/BLXn7wywuYMJwO4A3L0/XIkG9BybfiOGPPt/bDp/2oIOAWAICAB8IyctICu/DoCPMQJwRgzaAsIvlaYBFgABQA7iEIjkcwZwBoC/c0jf67cF2AKQh9kCkHy2AFuALYD9aVb6GAUNwKtgvwu4IIYcAsMWiqrnl0HDGSAMsMdAj4HIxPALIXSIQ9kbjP/rWQEoh4gOkQIgAOzvAmwBWYJ0gKz+8d0FIF6CbAICkNU/vrsAxEuQTUAAsvrHdxeAeAmyCQhAVv/47gIQL0E2AQHI6h/fXQDiJcgmIABZ/eO7C0C8BNkEMAA3byf0+wDZx3d3qsAhAFTC7ngB6K4fzl4AsITdCwhAd/1w9gKAJexeQAC664ezFwAsYfcCAtBdP5y9AGAJuxcQgO764ewFAEvYvYAAdNcPZy8AWMLuBQSgu344ewHAEnYv8AfVsZgumXzPzQAAAABJRU5ErkJggg==',
      content: 'hello 3'
    }

  ]

  useEffect(() => {
    let contentListTemp = contentList
    if (enterQuery && chatContract && account) {
      console.log(" ChatContent props:", props)
      chatContract.on("Send", (chatroom: any, sender: any, content: any, id: any) => {
        console.log("SendEvent",
          chatroom,
          sender,
          content,
          id
        )
        if (enterQuery === chatroom) {
          console.log("enterQuery === chatroom")
          contentListTemp.push(
            { 
              address: sender,
              ensName: '',
              avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA5NJREFUeF7tnbFNbDEQRf0kYrKVECUgoa0BiSaICYgpiJgyqGFFQAe0sYgWfCxdXfn8fOx5d87eGXsf+4+bt9N1gH/fn2cQPcbjywXF0/3R5iOfP9XvEACGAC0ABZjuLwCs/nEHEwDYgmD9BSBtYXR/AXAIRAxQC6YA0/2dAVD5PQWMNMF0f1h/ZwBaAGphdH8BcAZADKQBpvs7A6DyOwM4A4SvsnUAL4KQh9kCkHy2AFuALcCvg4mJ0GMsngF+bp/R+wDk4f9j6QNQAXfP/xAAhkA7wALA6l/vYAIgAM4AhAFbAFHPIRAfo6H8wxYAFdQBNhdQAAQAKZC+x7AFoPL1X2QJgAB4DCQMOAMQ9TwGegxs/wS15+8MsLmDCYAAdA+BsH7xcO8B4CtV8QrCBARAACBCLLx+BmCPn4/WAXSAKIU6QFT+4UUQvUgJ1w9vbwuwBWCIyAK2AKLeglgdQAdYgNH8EjrAvHZLInUAHWAJSLOL6ACzyi2K0wF0gEUozS2jA8zptixKB9ABlsE0sxB2AHqTl/4EzIi2MiatnwCsrObEWgIQ/pWviZotDREAAUBA0RZqC0Dy82AdQAdAFOkASL58sA6gAyAKdQAkXz5YB9ABEIU6AJIvH6wD6ACIQh0AyZcP1gF0AEShDoDkywfrADoAojDuACj7McbT6y9a4uvjHsXT4Pb88ZdBuwsoAJCAdgHb89cBNgdYAAQg+yNR7Rbanr8OoAPoAIQBHYCo5z3ASN9j2AI2B1gABMAZgDDgDEDUcwZwBmj/BLXn7wywuYMJwO4A3L0/XIkG9BybfiOGPPt/bDp/2oIOAWAICAB8IyctICu/DoCPMQJwRgzaAsIvlaYBFgABQA7iEIjkcwZwBoC/c0jf67cF2AKQh9kCkHy2AFuALYD9aVb6GAUNwKtgvwu4IIYcAsMWiqrnl0HDGSAMsMdAj4HIxPALIXSIQ9kbjP/rWQEoh4gOkQIgAOzvAmwBWYJ0gKz+8d0FIF6CbAICkNU/vrsAxEuQTUAAsvrHdxeAeAmyCQhAVv/47gIQL0E2AQHI6h/fXQDiJcgmIABZ/eO7C0C8BNkEMAA3byf0+wDZx3d3qsAhAFTC7ngB6K4fzl4AsITdCwhAd/1w9gKAJexeQAC664ezFwAsYfcCAtBdP5y9AGAJuxcQgO764ewFAEvYvYAAdNcPZy8AWMLuBQSgu344ewHAEnYv8AfVsZgumXzPzQAAAABJRU5ErkJggg==',
              content: content,
              time: 'Mon 08:17 PM'
            }
          )
          setContent(content)
        }
      })
    }
    // return () => {
    //   chatContract.off("Send",()=>{
    //     console.log("off send event")
    //   })
    // }
  }, [enterQuery]);
  console.log("content:", content)

  return (
    <ChatRoom>
      {contentList.map((data: any, index: number) => {
        return (
          <>
            <div className="d-flex align-items-end" key={index}>
              <img className="rounded-circle me-2" width="25" src={data.avatar} alt="Address" />
              <div className="d-flex flex-column gap-1">
                <div className="chat-ui-bubble">
                  <div className="small text-muted me-2">
                    <a className="link-muted" href="#" target="_blank">{data.address.substr(0, 5)}...{data.address.substr(-3)}</a> on {data.time}
                  </div>
                  <span>{data.content}</span>
                </div>
              </div>
            </div>
            <br />
          </>
        )
      })}
    </ChatRoom>
  )
}

