import { useCallback, useEffect, useMemo, useState } from "react";
import "react-chat-elements/dist/main.css";
import { t, Trans } from "@lingui/macro";
import { ButtonSecondary } from "../../components/Button";
import { AutoColumn } from "../../components/Column";
import { AutoRow } from "components/Row";
import Loader from "components/Loader";
import styled from "styled-components/macro";
import Modal from "components/Modal";
import { X } from "react-feather";
import { Input as NumericalInput } from "../NumericalInput";
import ethLogo from "assets/images/ethereum-logo.png";

const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
`;
const StyledNumericalInput = styled(NumericalInput)<{}>`
  text-align: left;
`;

export default function ChatProgress(props: any) {
  const [currentFund, setCurrentFund] = useState<any>(0);
  const [minFund, setMinFund] = useState<any>();
  const [value, setValue] = useState<any>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { contract, account, chatRoomAddress } = props;

  const changeProgress = useCallback(() => {
    let percentage = "0";
    if (currentFund && minFund && currentFund < minFund) {
      percentage = ((currentFund / minFund) * 100).toString();
    } else if (!minFund || !currentFund) {
      percentage = "0";
    } else {
      percentage = "100";
    }
    const element = document.querySelector(".g-progress") as HTMLElement;
    if (element && percentage) {
      // element.style.setProperty("--progress", percentage)
      element.style.setProperty(
        "background",
        `linear-gradient(90deg, #0f0, #fb7962 ${percentage}%, transparent 0)`
      );
    }
  }, [currentFund, minFund]);

  const getProgress = async () => {
    if (contract) {
      const getMinFund = await contract.minETHAmount();
      setMinFund(parseFloat(getMinFund.toString()) / 10 ** 18);
    }
    if (contract && account && chatRoomAddress) {
      const chatroomStatus = await contract.chatroomStatus(chatRoomAddress);
      setCurrentFund(
        parseFloat(chatroomStatus.totalFund.toString()) / 10 ** 18
      );
    }
  };

  const trigerInvest = async () => {
    if (contract && chatRoomAddress && value) {
      setLoading(true);
      try {
        const invest = await contract.invest(chatRoomAddress, {
          from: account,
          value: (value * 10 ** 18).toString(),
        });
        setValue("");
        invest.wait().then(() => {
          getProgress();
          setLoading(false);
        });
      } catch (e) {
        console.log("err", e);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getProgress();
    changeProgress();
  }, [contract, account, chatRoomAddress, currentFund, minFund]);

  const toggleModal = () => {
    setValue("");
    setIsOpen(false);
  };
  const handleClickInvest = () => {
    if (account && contract && chatRoomAddress) {
      setIsOpen(true);
    }
  };
  const onUserInput = useCallback((typedValue: string) => {
    setValue(typedValue);
  }, []);

  const onClickInvestOk = useCallback(() => {
    setIsOpen(false);
    trigerInvest();
  }, [contract, chatRoomAddress, value]);

  return (
    <>
      <AutoRow justify="center">
        <span className="progress-hint">Chatroom token are being created</span>
      </AutoRow>
      <AutoRow justify="space-between">
        <AutoColumn style={{ width: "90%"}}>
          <div className="g-progress">
            {minFund
              ? currentFund + " ETH / " + minFund + " ETH"
              : "please connect wallet"}
          </div>
        </AutoColumn>
        <AutoColumn>
          {loading ? 
          <Loader />
          :
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="plus-circle"
            width="25px"
            height="25px"
            fill="currentColor"
            aria-hidden="true"
            onClick={handleClickInvest}
          > 
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
              fill="#1890ff"
            ></path>
            <path
              d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm192 396c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48z"
              fill="#e6f7ff"
            ></path>
            <path
              d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"
              fill="#1890ff"
            ></path>
          </svg>
          }
        </AutoColumn>
      </AutoRow>

      <Modal
        isOpen={isOpen}
        onDismiss={toggleModal}
        maxHeight={35}
        minHeight={35}
      >
        <CloseIcon
          onClick={toggleModal}
          style={{ zIndex: 99, position: "relative", left: "90%" }}
          color="black"
        />
        <AutoRow>
          <div>
            <StyledNumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={onUserInput}
            />
            <NumericalInput
              style={{
                borderRadius: "20px",
                height: "70px",
                width: "300px",
                marginTop: "20px",
                textAlign: "left",
                marginRight: "2px",
              }}
              onUserInput={onUserInput}
              value={value}
            />
            <img src={ethLogo} width="32px" height="32px" />
            <span
              style={{ fontSize: "18px", fontWeight: 500, marginLeft: "1px" }}
            >
              ETH
            </span>
          </div>
          <div style={{ display: "flex", paddingLeft: "20%" }}>
            <ButtonSecondary
              onClick={onClickInvestOk}
              style={{ height: "30px", width: "100px", marginRight: "20px" }}
            >
              OK
            </ButtonSecondary>
            <ButtonSecondary
              onClick={toggleModal}
              style={{ height: "30px", width: "100px" }}
            >
              Cancel
            </ButtonSecondary>
          </div>
        </AutoRow>
      </Modal>
    </>
  );
}
