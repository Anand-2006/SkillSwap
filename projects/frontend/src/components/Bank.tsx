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
  initialAmount?: string
  initialMemo?: string
  initialReceiver?: string
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

const Bank = ({ openModal, closeModal, initialAmount, initialMemo, initialReceiver }: BankProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const { activeAddress, transactionSigner } = useWallet()
  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = useMemo(() => AlgorandClient.fromConfig({ algodConfig, indexerConfig }), [algodConfig, indexerConfig])
  const [appId, setAppId] = useState<number | ''>(748154508) // Default to a known ID or keep 0
  const [deploying, setDeploying] = useState<boolean>(false)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [memo, setMemo] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [statements, setStatements] = useState<Statement[]>([])
  const [depositors, setDepositors] = useState<Array<{ address: string; amount: string }>>([])
  const [activeTab, setActiveTab] = useState<'transactions' | 'depositors'>('transactions')

  useEffect(() => {
    algorand.setDefaultSigner(transactionSigner)
  }, [algorand, transactionSigner])

  // Pre-fill effect
  useEffect(() => {
    if (openModal) {
      if (initialAmount) setDepositAmount(initialAmount)
      if (initialMemo) setMemo(initialMemo)
      if (initialReceiver) setReceiverAddress(initialReceiver)
    }
  }, [openModal, initialAmount, initialMemo, initialReceiver])

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
        .filter((t: any) => (t.sender === appAddr))
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
        sender: activeAddress,
        boxReferences: [{ appId: BigInt(appId), name: algosdk.decodeAddress(activeAddress).publicKey }]
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
      if (!receiverAddress) throw new Error('Enter receiver address')
      setLoading(true)

      const client = new BankClient({ appId: BigInt(appId), algorand, defaultSigner: transactionSigner })
      await client.send.withdraw({
        args: { amount: amountMicroAlgos, receiver: receiverAddress },
        sender: activeAddress,
        extraFee: microAlgos(2000),
        boxReferences: [{ appId: BigInt(appId), name: algosdk.decodeAddress(activeAddress).publicKey }]
      })

      enqueueSnackbar(`Successfully released ${amount} ALGO to ${receiverAddress.substring(0, 8)}...`, { variant: 'success' })
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
      <div className="modal-box bg-zinc-950 border border-zinc-800 p-0 overflow-hidden max-w-6xl w-full rounded-md shadow-2xl flex flex-col h-[750px]">

        {/* Modal Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-400 text-xl">account_balance</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-50 tracking-tight">Task Escrow Terminal</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">
                  Network: TestNet // Node: <span className="text-zinc-300 font-mono">{appId || 'INITIALIZING'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-1">Total Pool Liquidity</span>
              <span className="text-xl font-mono font-bold text-white tracking-tighter">{totalValueLocked} ALGO</span>
            </div>
            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all border border-transparent hover:border-zinc-700">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Sidebar / Configuration */}
          <div className="w-full lg:w-80 bg-zinc-900 border-b lg:border-b-0 lg:border-r border-zinc-800 p-6 flex flex-col gap-8 overflow-y-auto">

            <section className="space-y-4">
              <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">System // Init</label>
              <div className="space-y-3">
                <div className="group">
                  <input
                    type="number"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-3 text-xs font-mono text-zinc-300 placeholder-zinc-700 focus:border-indigo-600/50 transition-all outline-none"
                    placeholder="Enter Contract ID..."
                    value={appId}
                    onChange={(e) => setAppId(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <button
                  onClick={deployContract}
                  disabled={deploying || !activeAddress}
                  className="w-full py-3 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all disabled:opacity-30 border border-zinc-700"
                >
                  {deploying ? 'Deploying Protocol...' : 'Initialize New Escrow'}
                </button>
              </div>
            </section>

            <section className="border-t border-zinc-800 pt-8 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Payload // Deposit</h4>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-4 text-xl font-mono text-white placeholder-zinc-800 transition-all outline-none focus:border-indigo-600/50"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-600 uppercase font-mono">ALGO</span>
                </div>
                <input
                  type="text"
                  placeholder="Reference Memo [Task ID]"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-3 text-[10px] font-mono text-zinc-400 placeholder-zinc-800 outline-none"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
                <button
                  onClick={deposit}
                  disabled={loading || !appId}
                  className="w-full py-4 bg-indigo-600 text-white hover:bg-indigo-500 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all"
                >
                  {loading ? 'Processing...' : 'Lock Funds in Escrow'}
                </button>
              </div>
            </section>

            <section className="border-t border-zinc-800 pt-8 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Command // Release</h4>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-4 text-xl font-mono text-white placeholder-zinc-800 transition-all outline-none focus:border-emerald-600/30"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-600 uppercase font-mono">ALGO</span>
                </div>
                <input
                  type="text"
                  placeholder="Receiver Address"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-3 text-[10px] font-mono text-zinc-400 placeholder-zinc-800 outline-none focus:border-emerald-600/30"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                />
                <button
                  onClick={withdraw}
                  disabled={loading || !appId}
                  className="w-full py-4 bg-zinc-800 border border-zinc-700 text-emerald-500 hover:bg-zinc-950 hover:border-emerald-600/30 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all"
                >
                  {loading ? 'Processing...' : 'Authorize Payout'}
                </button>
              </div>
            </section>

          </div>

          {/* Main Dashboard Panel */}
          <div className="flex-1 flex flex-col bg-zinc-950">
            <div className="px-8 pt-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex gap-10">
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative font-mono ${activeTab === 'transactions' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Transaction Log
                  {activeTab === 'transactions' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>}
                </button>
                <button
                  onClick={() => setActiveTab('depositors')}
                  className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative font-mono ${activeTab === 'depositors' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Active Controllers
                  {activeTab === 'depositors' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>}
                </button>
              </div>
              <div className="pb-4 hidden lg:flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-600 font-bold">ADDRESS:</span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-sm select-all cursor-copy" title="Click to copy">{appAddress || 'NOT_DEPLOYED'}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">

              {activeTab === 'transactions' && (
                <div>
                  {/* Grid Header */}
                  <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-zinc-950 border-b border-zinc-800 text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono">
                    <div className="col-span-2">Op Code</div>
                    <div className="col-span-1">Round</div>
                    <div className="col-span-5 text-center">TXN_ADDR / TRACE</div>
                    <div className="col-span-4 text-right">Value</div>
                  </div>

                  <div className="divide-y divide-zinc-900">
                    {statements.length === 0 ? (
                      <div className="p-24 flex flex-col items-center justify-center grayscale opacity-30 text-center">
                        <span className="material-symbols-outlined text-6xl mb-4 text-zinc-700">analytics</span>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-600">Zero network activity detected</p>
                      </div>
                    ) : (
                      statements.map((s) => (
                        <div key={s.id} className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-zinc-900 transition-all items-center group">
                          <div className="col-span-2">
                            <span className={`badge-solid font-mono ${s.type === 'deposit' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-indigo-900/40 text-indigo-400'}`}>
                              {s.type}
                            </span>
                          </div>
                          <div className="col-span-1 text-[10px] font-mono text-zinc-600 font-bold">
                            {s.round}
                          </div>
                          <div className="col-span-5 flex flex-col items-center">
                            <p className="text-zinc-400 text-[10px] font-mono truncate w-full max-w-[200px] group-hover:text-zinc-200 transition-colors">{(s.sender === activeAddress ? 'SELF_IDENTITY' : s.sender)}</p>
                            <a href={`https://lora.algokit.io/testnet/transaction/${s.id}`} target="_blank" rel="noreferrer" className="text-[9px] text-indigo-400 hover:underline font-mono mt-1 invisible group-hover:visible font-bold">
                              TRACE_0x{s.id.slice(0, 8)}
                            </a>
                          </div>
                          <div className="col-span-4 text-right">
                            <span className={`text-base font-mono font-bold tracking-tighter ${s.type === 'deposit' ? 'text-zinc-50' : 'text-zinc-500'}`}>
                              {s.type === 'deposit' ? '+' : '-'}{s.amount.toLocaleString(undefined, { minimumFractionDigits: 6 })}
                            </span>
                            <span className="text-[9px] font-bold text-zinc-700 ml-2 font-mono">ALGO</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'depositors' && (
                <div>
                  {/* Grid Header */}
                  <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-zinc-950 border-b border-zinc-800 text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono">
                    <div className="col-span-3">Entity Role</div>
                    <div className="col-span-6">Public Key // Address</div>
                    <div className="col-span-3 text-right">Allocated Balance</div>
                  </div>

                  <div className="divide-y divide-zinc-900">
                    {depositors.length === 0 ? (
                      <div className="p-24 flex flex-col items-center justify-center grayscale opacity-30 text-center">
                        <span className="material-symbols-outlined text-6xl mb-4 text-zinc-700">group</span>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-600">No contributors indexed</p>
                      </div>
                    ) : (
                      depositors.map((d) => (
                        <div key={d.address} className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-zinc-900 transition-all items-center">
                          <div className="col-span-3">
                            <span className="badge-solid bg-zinc-800 text-zinc-300 font-mono">
                              {d.address === activeAddress ? 'USER_PROPRIETOR' : 'EXTERNAL_NODE'}
                            </span>
                          </div>
                          <div className="col-span-6">
                            <p className="text-zinc-400 text-[10px] font-mono truncate select-all">{d.address}</p>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-base font-mono font-bold text-zinc-50 tracking-tighter">{parseFloat(d.amount).toFixed(2)}</span>
                            <span className="text-[9px] font-bold text-zinc-700 ml-2 font-mono">ALGO</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Footer Area */}
            <div className="px-8 py-4 border-t border-zinc-800 bg-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest font-bold">Node Sync: Online // Build_2.1-SECURE</span>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-sm border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 text-zinc-600 hover:text-white transition-all">
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-sm border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 text-zinc-600 hover:text-white transition-all">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-zinc-950/80">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  )
}

export default Bank
