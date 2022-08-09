import React, { useContext, useState, useCallback } from "react";
import { AutoColumn } from "../../components/Column";
import { AutoRow } from "../../components/Row";
import { TextInput, ResizingTextArea } from "components/TextInput";
import Loader from "../../components/Loader";
import {
	BaseButton,
	ButtonConfirmed,
	ButtonError,
	ButtonLight,
	ButtonPrimary,
	ButtonSecondary,
} from "../../components/Button";
import { t, Trans } from "@lingui/macro";
import { TransactionResponse } from "@ethersproject/abstract-provider"

export default function ChatSend(props: any) {
	const [inputMessage, setInputMessage] = useState<string>("");

	const onClickSend = useCallback(async () => {
		console.log("click send button");
		console.log("inputMessage:", inputMessage);
		console.log("chatContract props:", props);
		if (props.account && props.chatContract) {
			props.chatContract?.send(props.chatRoomAddress, props.account, inputMessage, {})
				.then((tx: TransactionResponse) => {
					console.log(tx)
					setInputMessage("")
				}).catch((e: Error) => console.log(e))
		}
	}, [inputMessage]);

	return (
		<>
			<AutoColumn>
				<TextInput
					className="messageInput"
					onUserInput={(e) => {
						setInputMessage(e)
					}}
					value={inputMessage}
					placeholder="please input message"
					fontSize="20px"
				/>
			</AutoColumn>
			<AutoColumn style={{ marginLeft: '10px' }}>
				<ButtonSecondary onClick={onClickSend}>
					<Trans>send</Trans>
				</ButtonSecondary>
			</AutoColumn>
		</>
	)
}

