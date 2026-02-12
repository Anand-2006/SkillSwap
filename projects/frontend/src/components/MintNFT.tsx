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
      <div className="modal-box bg-zinc-950 border border-zinc-800 p-0 overflow-hidden max-w-4xl shadow-2xl rounded-md flex flex-col md:flex-row h-[600px]">

        {/* Left Side: Upload & Preview Section */}
        <div className="w-full md:w-5/12 bg-zinc-900 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 relative group transition-colors">
          <div className="w-full aspect-square bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-sm overflow-hidden flex flex-col items-center justify-center transition-all group-hover:border-indigo-600/50 relative">
            {preview ? (
              <img src={preview} alt="NFT Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl text-zinc-700">add_photo_alternate</span>
                </div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed font-mono">
                  Select Digital Artifact<br />
                  <span className="text-zinc-800 font-mono font-normal lowercase mt-1 block">JPG, PNG, GIF (MAX 10MB)</span>
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="mt-10 w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono">Protocol Standard</span>
              <span className="text-indigo-400 text-[10px] font-bold tracking-widest font-mono">ARC-3 // IPFS</span>
            </div>
            <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 w-full opacity-60"></div>
            </div>
          </div>

          <div className="absolute bottom-6 left-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest font-bold">Encrypted Node Sync Ready</span>
          </div>
        </div>

        {/* Right Side: Configuration & Metadata */}
        <div className="w-full md:w-7/12 p-10 flex flex-col justify-between bg-zinc-950">

          <div className="space-y-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-zinc-50 uppercase tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Mint Artifact
                </h3>
                <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest font-bold mt-1">Immutable Network Deployment</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-sm border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-white transition-all hover:bg-zinc-800"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 font-mono">Asset Nomenclature</label>
                <input
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600/50 transition-all font-medium"
                  placeholder="Artifact Designation..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 font-mono">Manifest // Description</label>
                <textarea
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-4 text-[11px] text-zinc-400 placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600/50 transition-all font-mono resize-none leading-relaxed"
                  rows={4}
                  placeholder="Provide technical manifest..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${loading ? 'bg-zinc-800 text-zinc-600 pointer-events-none' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20'}`}
              onClick={onMint}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-1.5 h-1.5 bg-zinc-100 animate-ping rounded-full"></span>
                  SYCHRONIZING TO IPFS...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  INITIALIZE NETWORK MINT
                </>
              )}
            </button>

            <p className="text-[9px] text-zinc-700 font-mono text-center uppercase tracking-widest font-bold">
              Finalize to commit artifact to permanent storage.
            </p>
          </div>
        </div>

      </div>
      <form method="dialog" className="modal-backdrop bg-zinc-950/80">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  )
}

export default MintNFT
