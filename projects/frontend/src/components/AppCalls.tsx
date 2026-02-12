// src/components/AppCalls.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { CounterClient } from '../contracts/Counter'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const FIXED_APP_ID = 747652603
  const [appId, setAppId] = useState<number | null>(FIXED_APP_ID)
  const [currentCount, setCurrentCount] = useState<number>(0)
  const { enqueueSnackbar } = useSnackbar()
  const { activeAddress, transactionSigner: TransactionSigner } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })

  algorand.setDefaultSigner(TransactionSigner)

  const fetchCount = async (appId: number): Promise<number> => {
    try {
      const counterClient = new CounterClient({
        appId: BigInt(appId),
        algorand,
        defaultSigner: TransactionSigner,
      })
      const state = await counterClient.appClient.getGlobalState()
      return typeof state.count.value === 'bigint'
        ? Number(state.count.value)
        : parseInt(state.count.value as string, 10)
    } catch (e) {
      console.error('Error fetching count:', e)
      return 0
    }
  }

  useEffect(() => {
    const load = async () => {
      if (appId) {
        const count = await fetchCount(appId)
        setCurrentCount(count)
      }
    }
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, TransactionSigner])

  const incrementCounter = async () => {
    if (!appId) {
      enqueueSnackbar('Missing App ID', { variant: 'error' })
      return
    }

    setLoading(true)
    try {
      const counterClient = new CounterClient({
        appId: BigInt(appId),
        algorand,
        defaultSigner: TransactionSigner,
      })

      await counterClient.send.incrCounter({ args: [], sender: activeAddress ?? undefined })

      const count = await fetchCount(appId)
      setCurrentCount(count)

      enqueueSnackbar(`Counter incremented! New count: ${count}`, {
        variant: 'success'
      })
    } catch (e) {
      enqueueSnackbar(`Error incrementing counter: ${(e as Error).message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-zinc-950 border border-zinc-800 p-0 overflow-hidden max-w-md shadow-2xl rounded-md">

        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-zinc-50 flex items-center gap-2 tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              On-Chain Counter
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono font-bold mt-0.5 uppercase tracking-widest">Protocol // Core_State_v1</p>
          </div>
          <button
            onClick={() => setModalState(false)}
            className="text-zinc-600 hover:text-white transition-all w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-sm"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">data_object</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-6 font-mono bg-zinc-900 px-2 py-0.5 rounded-sm border border-zinc-800">Application ID: {appId}</span>

              <div className="flex flex-col items-center justify-center py-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">Current Register Value</span>
                <span className="text-7xl font-mono font-bold text-white tracking-tighter">{currentCount}</span>
                <div className="w-12 h-0.5 bg-indigo-600 mt-4 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className={`w-full py-4 bg-indigo-600 text-white hover:bg-indigo-500 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all disabled:opacity-30 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 active:scale-[0.98]`}
              onClick={incrementCounter}
              disabled={loading || !appId}
            >
              {loading ? (
                <>
                  <span className="w-1.5 h-1.5 bg-white animate-ping rounded-full"></span>
                  Processing Sequence...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Increment Registry
                </>
              )}
            </button>
            <p className="text-center text-[9px] text-zinc-600 font-mono font-bold uppercase tracking-widest">
              Execution Path: NoOp call to increment global_state
            </p>
          </div>
        </div>

        {/* Footer Area */}
        <div className="bg-zinc-900 p-4 border-t border-zinc-800 flex justify-between items-center px-8">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest font-bold">State: Verified</span>
          </div>
          <button
            className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-all"
            onClick={() => setModalState(false)}
            disabled={loading}
          >
            Close Terminal
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default AppCalls