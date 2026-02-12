import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import Account from './Account'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  return (
    <dialog id="connect_wallet_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-zinc-950 border border-zinc-800 rounded-md p-8 shadow-2xl">
        <h3 className="font-bold text-xl text-zinc-50 uppercase tracking-tight mb-6">Select Identity Provider</h3>

        <div className="flex flex-col gap-3">
          {activeAddress && (
            <div className="mb-4">
              <Account />
              <div className="h-px bg-zinc-800 my-6" />
            </div>
          )}

          {!activeAddress &&
            wallets?.map((wallet) => (
              <button
                data-test-id={`${wallet.id}-connect`}
                className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-sm hover:bg-zinc-800 hover:border-zinc-700 transition-all text-zinc-100 font-bold text-sm"
                key={`provider-${wallet.id}`}
                onClick={() => {
                  return wallet.connect()
                }}
              >
                {!isKmd(wallet) && (
                  <img
                    alt={`wallet_icon_${wallet.id}`}
                    src={wallet.metadata.icon}
                    style={{ objectFit: 'contain', width: '24px', height: '24px' }}
                  />
                )}
                <span className="font-mono uppercase tracking-widest text-[10px]">{isKmd(wallet) ? 'LocalNet Operator' : wallet.metadata.name}</span>
              </button>
            ))}
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-900">
          <button
            data-test-id="close-wallet-modal"
            className="px-6 py-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all"
            onClick={() => {
              closeModal()
            }}
          >
            Close
          </button>
          {activeAddress && (
            <button
              className="px-6 py-2 bg-rose-900/20 border border-rose-900/30 text-rose-500 hover:bg-rose-900/40 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all"
              data-test-id="logout"
              onClick={async () => {
                if (wallets) {
                  const activeWallet = wallets.find((w) => w.isActive)
                  if (activeWallet) {
                    await activeWallet.disconnect()
                  } else {
                    localStorage.removeItem('@txnlab/use-wallet:v3')
                    window.location.reload()
                  }
                }
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-zinc-950/80">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  )
}
export default ConnectWallet
