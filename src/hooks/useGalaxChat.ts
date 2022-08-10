import CHAT_ABI from 'abis/galax-chat-message.json'
import { GALAX_CHAT_ADDRESSES } from 'constants/addresses'
import { useContract } from 'hooks/useContract'

// returns null on errors
export function useChatContract() {
    return useContract(GALAX_CHAT_ADDRESSES, CHAT_ABI, true)
}