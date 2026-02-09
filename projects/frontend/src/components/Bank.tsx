// src/components/Bank.tsx
import { useEffect, useMemo, useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import algosdk, { getApplicationAddress, makePaymentTxnWithSuggestedParamsFromObject } from 'algosdk'
import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils'
import { BankClient, BankFactory } from '../contracts/Bank'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface BankProps {
  openModal: boolean
  closeModal: () => void
}

type Statement = {
  id: string
  round: number
  amount: number
  type: 'deposit' | 'withdrawal'
  sender: string
  receiver: string
  timestamp?: number
}

const Bank = ({ openModal, closeModal }: BankProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const { activeAddress, transactionSigner } = useWallet()
  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = useMemo(() => AlgorandClient.fromConfig({ algodConfig, indexerConfig }), [algodConfig, indexerConfig])
  const [appId, setAppId] = useState<number | ''>(0)
  const [deploying, setDeploying] = useState<boolean>(false)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [memo, setMemo] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [statements, setStatements] = useState<Statement[]>([])
  const [depositors, setDepositors] = useState<Array<{ address: string; amount: string }>>([])
  const [activeTab, setActiveTab] = useState<'transactions' | 'depositors'>('transactions')

  useEffect(() => {
    algorand.setDefaultSigner(transactionSigner)
  }, [algorand, transactionSigner])

  const appAddress = useMemo(() => (appId && appId > 0 ? String(getApplicationAddress(appId)) : ''), [appId])

  const refreshStatements = async () => {
    try {
      if (!appId || !activeAddress) return
      const idx = algorand.client.indexer
      const appAddr = String(getApplicationAddress(appId))
      const allTransactions: Statement[] = []

      const appTxRes = await idx
        .searchForTransactions()
        .address(activeAddress)
        .txType('appl')
        .do()

      const appTransactions = (appTxRes.transactions || [])
        .filter((t: any) => t.applicationTransaction && Number(t.applicationTransaction.applicationId) === Number(appId))
        .map((t: any) => {
          let amount = 0
          let type: 'deposit' | 'withdrawal' = 'deposit'

          if (t.logs && t.logs.length > 0) {
            const logStr = t.logs.join(' ')
            if (logStr.toLowerCase().includes('withdraw')) type = 'withdrawal'
          }

          if (t.innerTxns) {
            for (const innerTxn of t.innerTxns) {
              if (innerTxn.paymentTransaction) {
                amount = Number(innerTxn.paymentTransaction.amount) / 1000000
                if (innerTxn.sender === appAddr) type = 'withdrawal'
                break
              }
            }
          }

          return {
            id: t.id,
            round: Number(t.confirmedRound || t['confirmed-round']),
            amount,
            type,
            sender: t.sender,
            receiver: appAddr,
            timestamp: Number(t.roundTime || t['round-time']),
          }
        })

      allTransactions.push(...appTransactions)

      const payTxRes = await idx
        .searchForTransactions()
        .address(appAddr)
        .txType('pay')
        .do()

      const paymentTransactions = (payTxRes.transactions || [])
        .filter((t: any) => (t.sender === appAddr && t.paymentTransaction?.receiver === activeAddress))
        .map((t: any) => ({
          id: t.id,
          round: Number(t.confirmedRound || t['confirmed-round']),
          amount: Number(t.paymentTransaction.amount) / 1000000,
          type: 'withdrawal' as const,
          sender: t.sender,
          receiver: t.paymentTransaction.receiver,
          timestamp: Number(t.roundTime || t['round-time']),
        }))

      allTransactions.push(...paymentTransactions)
      setStatements(allTransactions.sort((a, b) => b.round - a.round))
    } catch (e) {
      console.error(e);
      // enqueueSnackbar(`Error loading statements: ${(e as Error).message}`, { variant: 'error' })
    }
  }

  const refreshDepositors = async () => {
    try {
      if (!appId) return
      const algod = algorand.client.algod
      const boxes = await algod.getApplicationBoxes(appId).do()
      const list = [] as Array<{ address: string; amount: string }>
      for (const b of boxes.boxes as Array<{ name: Uint8Array }>) {
        const nameBytes: Uint8Array = b.name
        if (nameBytes.length !== 32) continue
        const box = await algod.getApplicationBoxByName(appId, nameBytes).do()
        const addr = algosdk.encodeAddress(nameBytes)
        const valueBuf: Uint8Array = box.value
        const amountMicroAlgos = BigInt(new DataView(Buffer.from(valueBuf).buffer).getBigUint64(0, false))
        const amountAlgos = (Number(amountMicroAlgos) / 1000000).toString()
        list.push({ address: addr, amount: amountAlgos })
      }
      setDepositors(list)
    } catch (e) {
      console.error(e);
      // enqueueSnackbar(`Error loading depositors: ${(e as Error).message}`, { variant: 'error' })
    }
  }

  useEffect(() => {
    void refreshStatements()
    void refreshDepositors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, activeAddress])

  const deposit = async () => {
    try {
      if (!activeAddress) throw new Error('Connect wallet first')
      if (!appId || appId <= 0) throw new Error('Enter valid App ID')
      const amountAlgos = Number(depositAmount)
      if (!amountAlgos || amountAlgos <= 0) throw new Error('Enter amount in Algos')
      const amountMicroAlgos = Math.round(amountAlgos * 1000000)
      setLoading(true)

      const sp = await algorand.client.algod.getTransactionParams().do()
      const appAddr = getApplicationAddress(appId)

      const payTxn = makePaymentTxnWithSuggestedParamsFromObject({
        sender: activeAddress,
        receiver: appAddr,
        amount: amountMicroAlgos,
        suggestedParams: sp,
      })

      const client = new BankClient({ appId: BigInt(appId), algorand, defaultSigner: transactionSigner })
      await client.send.deposit({
        args: { memo: memo || '', payTxn: { txn: payTxn, signer: transactionSigner } },
        sender: activeAddress
      })

      enqueueSnackbar(`Successfully funded task with ${amountAlgos} ALGO`, { variant: 'success' })
      setDepositAmount('')
      setMemo('')
      void refreshStatements()
      void refreshDepositors()
    } catch (e) {
      enqueueSnackbar(`Funding failed: ${(e as Error).message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const withdraw = async () => {
    try {
      if (!activeAddress) throw new Error('Connect wallet first')
      if (!appId || appId <= 0) throw new Error('Enter valid App ID')
      const amount = Number(withdrawAmount)
      if (!amount || amount <= 0) throw new Error('Enter amount in Algos')
      const amountMicroAlgos = Math.round(amount * 1000000)
      setLoading(true)

      const client = new BankClient({ appId: BigInt(appId), algorand, defaultSigner: transactionSigner })
      await client.send.withdraw({
        args: { amount: amountMicroAlgos },
        sender: activeAddress,
        extraFee: microAlgos(2000)
      })

      enqueueSnackbar(`Successfully released ${amount} ALGO`, { variant: 'success' })
      setWithdrawAmount('')
      void refreshStatements()
      void refreshDepositors()
    } catch (e) {
      enqueueSnackbar(`Release failed: ${(e as Error).message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const deployContract = async () => {
    try {
      if (!activeAddress) throw new Error('Connect wallet')
      setDeploying(true)
      const factory = new BankFactory({ defaultSender: activeAddress, algorand })
      const result = await factory.send.create.bare()
      const newId = Number(result.appClient.appId)
      setAppId(newId)
      enqueueSnackbar(`Task Escrow Created. ID: ${newId}`, { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(`Creation failed: ${(e as Error).message}`, { variant: 'error' })
    } finally {
      setDeploying(false)
    }
  }

  const totalValueLocked = depositors.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toFixed(2);

  return (
    <dialog id="bank_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-[#0f172a] border border-slate-700/50 p-0 overflow-hidden max-w-5xl w-full rounded-xl shadow-2xl backdrop-blur-xl">

        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-slate-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Task Escrow Pool</h3>
              <p className="text-xs text-slate-500 font-mono">Contract ID: <span className="text-slate-300">{appId || 'Not Selected'}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Value Locked</span>
              <span className="text-lg font-mono font-medium text-slate-200">{totalValueLocked} ALGO</span>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[650px]">
          {/* Sidebar Controls */}
          <div className="w-full lg:w-80 bg-[#0f172a] border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-8 overflow-y-auto">

            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contract Configuration</label>
              <div className="space-y-3">
                <input
                  type="number"
                  className="input-field text-sm font-mono"
                  placeholder="Enter App ID..."
                  value={appId}
                  onChange={(e) => setAppId(e.target.value === '' ? '' : Number(e.target.value))}
                />
                <button
                  onClick={deployContract}
                  disabled={deploying || !activeAddress}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-md transition-all border border-slate-700 shadow-sm"
                >
                  {deploying ? 'Deploying Contract...' : 'Create New Escrow'}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 space-y-4">
              <h4 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                Fund Task
              </h4>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="input-field text-lg font-medium pl-4 pr-12"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-slate-500 font-bold">ALGO</span>
                </div>
                <input
                  type="text"
                  placeholder="Memo / Reference"
                  className="input-field text-xs"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
                <button
                  onClick={deposit}
                  disabled={loading || !appId}
                  className="btn-primary w-full py-2 text-xs"
                >
                  Deposit Funds
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 space-y-4">
              <h4 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                Release Payment
              </h4>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="input-field text-lg font-medium pl-4 pr-12"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-slate-500 font-bold">ALGO</span>
                </div>
                <button
                  onClick={withdraw}
                  disabled={loading || !appId}
                  className="w-full py-2 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-md text-xs font-medium transition-colors"
                >
                  Release to Worker
                </button>
              </div>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-[#0f172a]/50">
            <div className="border-b border-slate-800 px-8 pt-6 flex gap-8">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-emerald-500 text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Transaction Log
              </button>
              <button
                onClick={() => setActiveTab('depositors')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'depositors' ? 'border-emerald-500 text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Contributors
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-8 py-3 bg-slate-900/30 border-b border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <div className="col-span-2">Type</div>
                <div className="col-span-6">Details / Sender</div>
                <div className="col-span-4 text-right">Amount</div>
              </div>

              {activeTab === 'transactions' && (
                <div className="divide-y divide-slate-800/50">
                  {statements.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-slate-500 text-sm">No activity recorded on this contract yet.</p>
                      <p className="text-slate-600 text-xs mt-1">Deploy a contract or enter an App ID to view data.</p>
                    </div>
                  ) : (
                    statements.map((s) => (
                      <div key={s.id} className="grid grid-cols-12 gap-4 px-8 py-4 hover:bg-slate-800/20 transition-colors items-center group">
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${s.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {s.type}
                          </span>
                        </div>
                        <div className="col-span-6">
                          <p className="text-slate-300 text-xs font-mono truncate mb-0.5">{s.sender}</p>
                          <a href={`https://lora.algokit.io/testnet/transaction/${s.id}`} target="_blank" rel="noreferrer" className="text-[10px] text-slate-600 hover:text-emerald-500 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
                            View Explorer
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        </div>
                        <div className="col-span-4 text-right">
                          <span className={`font-mono text-sm font-medium ${s.type === 'deposit' ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {s.type === 'deposit' ? '+' : '-'}{s.amount.toFixed(4)} <span className="text-xs text-slate-600">ALGO</span>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'depositors' && (
                <div className="divide-y divide-slate-800/50">
                  {depositors.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-slate-500 text-sm">No contributors found.</p>
                    </div>
                  ) : (
                    depositors.map((d) => (
                      <div key={d.address} className="grid grid-cols-12 gap-4 px-8 py-4 hover:bg-slate-800/20 transition-colors items-center">
                        <div className="col-span-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Holder
                          </span>
                        </div>
                        <div className="col-span-6">
                          <p className="text-slate-300 text-xs font-mono truncate">{d.address}</p>
                        </div>
                        <div className="col-span-4 text-right">
                          <span className="font-mono text-sm font-medium text-slate-200">{parseFloat(d.amount).toFixed(2)} <span className="text-xs text-slate-600">ALGO</span></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-slate-950/80 backdrop-blur-sm">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  )
}

export default Bank

// End of file
