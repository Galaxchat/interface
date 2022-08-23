import { useState, useCallback, useRef, useEffect } from "react";
import Loader from "components/Loader";
import { t, Trans } from "@lingui/macro";
import { ButtonSecondary } from "../Button";
import { AutoColumn } from "../../components/Column";
import { AutoRow } from "../../components/Row";
import Logo from "components/Logo";
import ethLogo from "assets/images/ethereum-logo.png";
import ChatModalType from "./ChatModalType";

export default function ChatRoomNameBar(props: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [info, setInfo] = useState<string>("");
  const { contract, account, chatRoomInfo, percentage, changeRoomInfo } = props;

  const onClickCreateToken = useCallback(async () => {
    const token = chatRoomInfo?.token
    const chatRoomAddress = chatRoomInfo?.address
    if (account && contract && chatRoomAddress && !token) {
      if (percentage >= 100) {
        setLoading(true)
        try {
          const createToken = await contract.createToken(chatRoomAddress)
          createToken.wait().then(async () => {
            setLoading(false);
            const chatroomStatus = await contract.chatroomStatus(chatRoomInfo?.address);
            let tempRoomInfo = { ...chatRoomInfo}
            if (chatroomStatus.token != "0x0000000000000000000000000000000000000000" && chatRoomInfo.token != chatroomStatus.token) {
              tempRoomInfo.token = chatroomStatus.token
              tempRoomInfo.pair = chatroomStatus.pair
              changeRoomInfo(tempRoomInfo)
            }
          });
        } catch (e) {
          setLoading(false);
          setModalType("transactionError");
          const reg = /Error: (.*) \[/;
          const regResult = reg.exec(e.toString()) ? reg.exec(e.toString()) : ""
          const text = regResult ? regResult[1].trim() : "It seems something wrong";
          setInfo(text)
          setIsOpen(true);
        }
      } else {
        setModalType("noFullProgress")
        setIsOpen(true)
      }
    } else if (token) {
      setModalType("tokenCreated")
      setIsOpen(true)
    } else if (!account) {
      setModalType("notConnect")
      setIsOpen(true);
    } else if (!chatRoomAddress) {
      setModalType("notSearch")
      setIsOpen(true);
    }

  }, [account, contract, chatRoomInfo, percentage]);


  return (
    <>
      <AutoColumn justify="flex-start">
        <AutoRow>
          {(chatRoomInfo && chatRoomInfo.imageURL) ?
            <Logo
              srcs={[chatRoomInfo.imageURL]}
              style={{
                width: "30px",
                height: "30px",
                margin: "0px 10px",
              }}
            ></Logo>
            :
            <Logo
              srcs={[ethLogo]}
              style={{
                width: "30px",
                height: "30px",
                margin: "0px 10px",
              }}
            ></Logo>
          }
          Chatroom{chatRoomInfo?.name ?
            chatRoomInfo?.name.length <= 18 ?
              '@' + chatRoomInfo.name : "@" + chatRoomInfo.name.substr(0, 6) + "...." + chatRoomInfo.name.substr(-4)
            : ''}
        </AutoRow>
      </AutoColumn>
      {chatRoomInfo?.token ?
        null
        :
        <AutoColumn justify="flex-end" style={{}}>
          {loading ?
            <ButtonSecondary style={{ pointerEvents: "none" }}>
              <Loader />
            </ButtonSecondary>
            :
            <ButtonSecondary onClick={onClickCreateToken}>
              <Trans> CreateToken</Trans>
            </ButtonSecondary>
          }
        </AutoColumn>
      }
      {modalType ?
        <ChatModalType
          showModal={(open: boolean) => { setIsOpen(open) }}
          type={modalType}
          isOpen={isOpen}
          info={info}
        />
        : null
      }
    </>
  )
}