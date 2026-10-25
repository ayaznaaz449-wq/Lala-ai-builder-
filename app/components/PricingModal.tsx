export function PricingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl text-center max-w-sm w-full border">
        <h2 className="text-2xl font-bold text-red-600">⚠️ Free Khatam!</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">30 prompts muft khatam ho gaye</p>
        
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200">
          <h3 className="text-2xl font-bold text-green-600">DAHERI AI PRO</h3>
          <p className="text-3xl font-black mt-1">Rs 500 <span className="text-sm font-normal">/ Month</span></p>
          <p className="text-sm mt-2">Unlimited Prompts + Fast Speed</p>
        </div>

        <div className="mt-6 bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl">
          <p className="text-sm">Easypaisa Account</p>
          <p className="text-2xl font-black tracking-widest">03703290378</p>
          <p className="text-xs mt-1">Title: DAHERI AI</p>
        </div>

        <a 
          href="https://wa.me/923703290378?text=Salam%20Bhai%20DAHERI%20AI%20PRO%20chahiye%2C%20Rs%20500%20Easypaisa%20kar%20diya%20hai%2003703290378%20pe" 
          target="_blank"
          className="mt-4 block bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold"
        >
          WhatsApp Pe Screenshot Bhejo
        </a>
        
        <button onClick={onClose} className="mt-3 text-sm text-zinc-500 underline">Baad me</button>
      </div>
    </div>
  )
}
