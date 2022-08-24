import { useCallback, useEffect, useMemo, useState,useRef } from "react";
import "react-chat-elements/dist/main.css";
import { t, Trans } from "@lingui/macro";
import { ButtonSecondary } from "../Button";
import { AutoColumn } from "../Column";
import { AutoRow } from "components/Row";
import Loader from "components/Loader";
import { Input as NumericalInput } from "../NumericalInput";
import ethLogo from "assets/images/ethereum-logo.png";
import ChatModal from "./ChatModal";
import ChatModalType from "./ChatModalType";

export default function ChatProgress(props: any) {
  const [currentFund, setCurrentFund] = useState<any>(0);
  const [minFund, setMinFund] = useState<any>();
  const [value, setValue] = useState<any>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const { contract, account, chatRoomInfo, changePercentage, changeRoomInfo } = props;


  useEffect(() => {
    let isUnmount = false; 
    getProgress(isUnmount);
    changeProgress();
    return () => {isUnmount = true};
  }, [contract, account, chatRoomInfo, currentFund, minFund]);

  const changeProgress = useCallback(() => {
    let percentage = "0";
    if (currentFund && minFund && currentFund < minFund) {
      percentage = ((currentFund / minFund) * 100).toString();
    } else if (!minFund || !currentFund) {
      percentage = "0";
    } else {
      percentage = "100";
    }
    changePercentage(parseFloat(percentage));
    const element = document.querySelector(".g-progress") as HTMLElement;
    if (element && percentage) {
      element.style.setProperty(
        "background",
        `linear-gradient(90deg, rgb(0 29 255), rgb(251 98 98) ${percentage}%, transparent 0px)`
      );
    }
  }, [currentFund, minFund]);

  const getProgress = useCallback(async (isUnmount?) => {
    if (contract) {
      const getMinFund = await contract.minETHAmount();
      if ( !isUnmount || isUnmount=== undefined) {
        setMinFund(parseFloat(getMinFund.toString()) / 10 ** 18);}
    }
    if (contract && account && chatRoomInfo?.address) {
      const chatroomStatus = await contract.chatroomStatus(chatRoomInfo?.address);
      let tempRoomInfo = { ...chatRoomInfo}
      if (chatroomStatus.token != "0x0000000000000000000000000000000000000000" && chatRoomInfo.token != chatroomStatus.token) {
        tempRoomInfo.token = chatroomStatus.token
        tempRoomInfo.pair = chatroomStatus.pair
        changeRoomInfo(tempRoomInfo)
      }

      setCurrentFund(
        parseFloat(chatroomStatus.totalFund.toString()) / 10 ** 18
      );
    }
  }, [contract , chatRoomInfo, account]) 

  const trigerInvest = async () => {
    if (contract && chatRoomInfo?.address && value) {
      setLoading(true);
      try {
        const invest = await contract.invest(chatRoomInfo?.address, {
          from: account,
          value: (value * 10 ** 18).toString(),
        });
        setValue("");
        invest.wait().then(() => {
          getProgress();
          setLoading(false);
        });
      } catch (e) {
        setLoading(false);
        setModalType("transactionError");
        const text = e.message
        setInfo(text)
        setIsOpen(true);
      }
    }
  };

  const handleClickInvest = () => {
    if (account && contract && chatRoomInfo?.address) {
      setModalType("invest")
      setIsOpen(true);
    } else if (!account) {
      setModalType("notConnect")
      setIsOpen(true);
    } else if (!chatRoomInfo?.address) {
      setModalType("notSearch")
      setIsOpen(true);
    }
  };
  const showModal = (open: boolean) => {
    setIsOpen(open);
  };

  const onUserInput = useCallback((typedValue: string) => {
    setValue(typedValue);
  }, []);

  const onClickInvestOk = useCallback(() => {
    setIsOpen(false);
    trigerInvest();
  }, [contract, chatRoomInfo, value]);

  return (
    <>
      <AutoRow justify="center">
        <span className="progress-hint">Chatroom token are being created</span>
      </AutoRow>
      <AutoRow justify="space-between">
        <AutoColumn style={{ width: "80%" }}>
          <div className="g-progress">
            {minFund
              ? currentFund + " ETH / " + minFund + " ETH"
              : "please connect wallet"}
          </div>
        </AutoColumn>
        <AutoColumn>
          {loading ? (
            <ButtonSecondary style={{ pointerEvents: "none" }}>
              <Loader />
            </ButtonSecondary>
          ) : (
            <ButtonSecondary onClick={handleClickInvest}>
              <Trans>+</Trans>
            </ButtonSecondary>
          )}
        </AutoColumn>
      </AutoRow>

      {modalType === "invest" ?
        <ChatModal
          title="Invest"
          showModal={showModal}
          onClickOk={onClickInvestOk}
          isOpen={isOpen}
          InfoHtml={
            <AutoRow justify="space-between">
              <NumericalInput
                style={{
                  borderRadius: "20px",
                  height: "64px",
                  textAlign: "left",
                  marginRight: "5px",
                }}
                onUserInput={onUserInput}
                value={value}
              />
              <img src={ethLogo} width="32px" height="32px" />
              <span style={{ fontSize: "18px", fontWeight: 500 }}>ETH</span>
            </AutoRow>
          }
        />
        : <ChatModalType
          showModal={showModal}
          type={modalType}
          isOpen={isOpen}
          info={info}
        />
      }
    </>
  );
}
