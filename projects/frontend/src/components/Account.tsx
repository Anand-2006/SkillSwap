import { useWallet } from '@txnlab/use-wallet-react'
import { useMemo } from 'react'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

const Account = () => {
  const { activeAddress } = useWallet()
  const algoConfig = getAlgodConfigFromViteEnvironment()

  const networkName = useMemo(() => {
    return algoConfig.network === '' ? 'localnet' : algoConfig.network.toLocaleLowerCase()
  }, [algoConfig.network])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono">Authenticated Address</span>
        <a
          className="text-sm font-mono font-bold text-zinc-300 hover:text-indigo-400 transition-colors select-all"
          target="_blank"
          href={`https://lora.algokit.io/${networkName}/account/${activeAddress}/`}
          rel="noreferrer"
        >
          {activeAddress}
        </a>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono">Active Channel</span>
          <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-tight">{networkName}</span>
        </div>
      </div>
    </div>
  )
}

export default Account
