import {
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

export default function ChatSearch(props: any) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [enterQuery, setEnterQuery] = useState<string>("");

  const { chatContract, account, changeEnterQuery} = props
  const inputRef = useRef<HTMLInputElement>();

  const handleInput = useCallback((event) => {
    const input = event.target.value;
    setSearchQuery(input);
  }, []);

  
  const handleEnter = useCallback(async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      changeEnterQuery(searchQuery)
    }
  }, [searchQuery]);

  return (
    <>
      <AutoColumn gap={"lg"}>
        <SearchInput
          type="text"
          id="address-search-input"
          placeholder={t`Search name or paste address`}
          autoComplete="off"
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
      </AutoColumn>
    </>
  )
}

