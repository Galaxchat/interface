import { Contract } from '@ethersproject/contracts'
import CHAT_ABI from 'abis/galax-chat-message.json'
import { GALAX_CHAT_ADDRESSES } from 'constants/addresses'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useContract } from 'hooks/useContract'

import { getContract } from '../utils'

// returns null on errors
export function useChatContract() {
    return useContract(GALAX_CHAT_ADDRESSES, CHAT_ABI, true)
}