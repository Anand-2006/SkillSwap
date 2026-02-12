import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface TransactInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Transact = ({ openModal, setModalState }: TransactInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [receiverAddress, setReceiverAddress] = useState<string>('')

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  const { enqueueSnackbar } = useSnackbar()

  const { transactionSigner, activeAddress } = useWallet()

  const handleSubmitAlgo = async () => {
    setLoading(true)

    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      return
    }

    try {
      enqueueSnackbar('Sending transaction...', { variant: 'info' })
      const result = await algorand.send.payment({
        signer: transactionSigner,
        sender: activeAddress,
        receiver: receiverAddress,
        amount: algo(1),
      })
      enqueueSnackbar(`Transaction sent: ${result.txIds[0]}`, { variant: 'success' })
      setReceiverAddress('')
    } catch (e) {
      enqueueSnackbar('Failed to send transaction', { variant: 'error' })
    }

    setLoading(false)
  }

  return (
    <dialog id="transact_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-zinc-950 border border-zinc-800 p-0 overflow-hidden max-w-md shadow-2xl rounded-md">

        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-zinc-50 flex items-center gap-2 tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Send Payment
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono font-bold mt-0.5 uppercase tracking-widest">Protocol // Transfer_v1</p>
          </div>
          <button
            className="text-zinc-600 hover:text-white transition-all w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-sm"
            onClick={() => setModalState(!openModal)}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Recipient Input */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 font-mono">Target Address</label>
            <div className="relative">
              <input
                type="text"
                data-test-id="receiver-address"
                placeholder="0x..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600/50 font-mono transition-all"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
              />
              {receiverAddress && receiverAddress.length === 58 && (
                <div className="absolute right-3 top-3.5 text-emerald-500">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </div>
              )}
            </div>
            <p className="text-[9px] text-zinc-600 mt-2 font-mono flex justify-between font-bold">
              <span className="uppercase">Verification Status: {receiverAddress.length === 58 ? 'READY' : 'PENDING'}</span>
              <span className={`${receiverAddress.length === 58 ? 'text-emerald-500' : 'text-zinc-800'}`}>{receiverAddress.length}/58</span>
            </p>
          </div>

          {/* Amount Display */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Transaction Value</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-zinc-50 tracking-tighter">1.000000</span>
              <span className="text-[10px] font-bold text-zinc-600 uppercase font-mono">ALGO</span>
            </div>
          </div>

          {/* Network Fee Info */}
          <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-1 border-t border-zinc-900 pt-5 font-mono">
            <span>Protocol Fee</span>
            <span className="text-zinc-400">0.001 ALGO</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              className="flex-1 py-3 bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all border border-transparent"
              onClick={() => setModalState(!openModal)}
            >
              Cancel
            </button>
            <button
              data-test-id="send-algo"
              className={`flex-1 py-3 font-bold uppercase tracking-widest text-[10px] rounded-sm transition-all ${receiverAddress.length === 58 ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-zinc-800 text-zinc-700 cursor-not-allowed border border-zinc-700'}`}
              disabled={receiverAddress.length !== 58 || loading}
              onClick={handleSubmitAlgo}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white animate-ping rounded-full"></span>
                  Relaying...
                </span>
              ) : (
                'Authorize Transfer'
              )}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-zinc-950/80">
        <button onClick={() => setModalState(!openModal)}>close</button>
      </form>
    </dialog>
  )
}

export default Transact
