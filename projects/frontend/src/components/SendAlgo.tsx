// src/components/SendAlgo.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface SendAlgoProps {
  openModal: boolean
  closeModal: () => void
}

const SendAlgo = ({ openModal, closeModal }: SendAlgoProps) => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const algorand = useMemo(() => {
    const algodConfig = getAlgodConfigFromViteEnvironment()
    const client = AlgorandClient.fromConfig({ algodConfig })
    client.setDefaultSigner(transactionSigner)
    return client
  }, [transactionSigner])

  const onSend = async () => {
    if (!activeAddress) {
      enqueueSnackbar('Connect a wallet first', { variant: 'error' })
      return
    }
    const microAlgos = BigInt(Math.floor(Number(amount) * 1e6))
    if (!to || microAlgos <= 0n) {
      enqueueSnackbar('Enter valid address and amount', { variant: 'error' })
      return
    }
    setLoading(true)
    try {
      await algorand.send.payment({ sender: activeAddress, receiver: to, amount: algokit.microAlgos(microAlgos) })
      enqueueSnackbar('Payment sent successfully', { variant: 'success' })
      closeModal()
      setAmount('')
      setTo('')
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="send_algo_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-[#0f172a] border border-slate-700/50 p-0 overflow-hidden max-w-md shadow-2xl rounded-xl backdrop-blur-xl">

        <div className="p-6 border-b border-slate-700/50 bg-slate-900/30 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-100">Direct Transfer</h3>
          <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Recipient Wallet</label>
              <input
                type="text"
                className="input-field font-mono text-sm"
                placeholder="Enter Algo Address..."
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Amount (ALGO)</label>
              <div className="relative">
                <input
                  type="number"
                  className="input-field text-lg font-bold pl-4 pr-12"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="absolute right-3 top-3 text-xs text-slate-500 font-bold">ALGO</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium bg-emerald-900/10 px-3 py-2 rounded border border-emerald-900/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Verified Secure Transaction
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={closeModal}
              className="btn-secondary w-full"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onSend}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </>
              ) : 'Confirm Pay'}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-slate-950/80 backdrop-blur-sm">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  )
}

export default SendAlgo

// End of file
