// src/components/MintNFT.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { ipfsHttpUrl, pinFileToIPFS, pinJSONToIPFS } from '../utils/pinata'

interface MintNFTProps {
  openModal: boolean
  closeModal: () => void
}

const MintNFT = ({ openModal, closeModal }: MintNFTProps) => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const [name, setName] = useState('AlgoNFT')
  const [description, setDescription] = useState('My first NFT!')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const algorand = useMemo(() => {
    const algodConfig = getAlgodConfigFromViteEnvironment()
    const client = AlgorandClient.fromConfig({ algodConfig })
    client.setDefaultSigner(transactionSigner)
    return client
  }, [transactionSigner])

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  async function sha256Hex(data: Uint8Array): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', data.buffer as ArrayBuffer)
    const hashArray = Array.from(new Uint8Array(digest))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  const onMint = async () => {
    if (!activeAddress) {
      enqueueSnackbar('Connect a wallet first', { variant: 'error' })
      return
    }
    if (!file) {
      enqueueSnackbar('Select an image', { variant: 'error' })
      return
    }

    setLoading(true)
    try {
      const filePin = await pinFileToIPFS(file)
      const imageUrl = ipfsHttpUrl(filePin.IpfsHash)

      const metadata = {
        name,
        description,
        image: imageUrl,
        image_mimetype: file.type || 'image/png',
        external_url: imageUrl,
        properties: {
          creator: activeAddress,
          minted_at: new Date().toISOString(),
        },
      }

      const jsonPin = await pinJSONToIPFS(metadata)
      const metadataUrl = `${ipfsHttpUrl(jsonPin.IpfsHash)}#arc3`

      const metaBytes = new TextEncoder().encode(JSON.stringify(metadata))
      const metaHex = await sha256Hex(metaBytes)
      const metadataHash = new Uint8Array(metaHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))

      const result = await algorand.send.assetCreate({
        sender: activeAddress,
        total: 1n,
        decimals: 0,
        unitName: name.slice(0, 8).replace(/\s+/g, '').toUpperCase(),
        assetName: name,
        manager: activeAddress,
        reserve: activeAddress,
        freeze: activeAddress,
        clawback: activeAddress,
        url: metadataUrl,
        metadataHash,
        defaultFrozen: false,
      })

      enqueueSnackbar(`NFT minted successfully! Asset ID: ${result.assetId}`, { variant: 'success' })
      closeModal()
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="mint_nft_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box glass-card bg-slate-900/95 border-white/10 p-0 overflow-hidden max-w-2xl">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Preview */}
          <div className="w-full md:w-1/2 bg-white/5 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative group w-full aspect-square bg-slate-800 rounded-3xl overflow-hidden border-2 border-dashed border-white/20 flex flex-col items-center justify-center transition-all hover:border-indigo-500/50">
              {preview ? (
                <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Click to select asset</p>
                  <p className="text-slate-600 text-xs mt-1">PNG, JPG, GIF max 10MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="mt-8 w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">Standards</span>
                <span className="text-indigo-400 text-xs font-bold tracking-widest">ARC-3 / IPFS</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 w-full opacity-50"></div>
              </div>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">Create NFT</h3>
                  <p className="text-slate-400 text-sm mt-1">Configure your digital asset</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Asset Name</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="Enter NFT name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Description</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium resize-none"
                    rows={4}
                    placeholder="Describe your NFT..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                className={`btn-premium w-full flex items-center justify-center gap-2 ${loading ? 'opacity-80' : ''}`}
                onClick={onMint}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Minting Asset...
                  </>
                ) : (
                  'Deploy to Mainnet'
                )}
              </button>
              <button
                className="w-full py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel Process
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default MintNFT

