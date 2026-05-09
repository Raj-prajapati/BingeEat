import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, MapPin, Navigation, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useAddressStore from "@/store/addressStore";
import { useAuthStore } from "@/store/useAuthStore";

const LocationModal = ({ open, setOpen }) => {
  const [step, setStep] = useState(1)
  const [isLocating, setIsLocating] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [saveAddress, setSaveAddress] = useState(false)
  const [label, setLabel] = useState("Home")
  const [form, setForm] = useState({
    house: "",
    street: "",
    city: "",
    pincode: "",
  })

  const debounceRef = useRef(null)
  const { setAddress, setFullAddress } = useAddressStore()
  const { saveAddress: saveToAccount } = useAuthStore()

  // reset everything when modal closes
  const handleOpenChange = (val) => {
    setOpen(val)
    if (!val) {
      setStep(1)
      setSearchQuery("")
      setSuggestions([])
      setShowSuggestions(false)
      setForm({ house: "", street: "", city: "", pincode: "" })
      setLabel("Home")
      setSaveAddress(false)
    }
  }

  // fetch suggestions from OpenStreetMap
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }
    setIsSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=in`,
        { headers: { "Accept-Language": "en", "User-Agent": "BingeEat App" } }
      )
      const data = await res.json()
      setSuggestions(data)
    } catch {
      toast.error("Could not fetch suggestions")
    } finally {
      setIsSearching(false)
    }
  }

  // debounced input handler
  const inputHandler = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSuggestions(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 500)
  }

  // user clicks a suggestion → fill form → go to step 2
  const handleSelectSuggestion = (suggestion) => {
    const addr = suggestion.address
    setForm({
      house: addr.house_number || "",
      street: addr.road || addr.neighbourhood || addr.suburb || "",
      city: addr.city || addr.town || addr.village || "",
      pincode: addr.postcode || "",
    })
    setSearchQuery(suggestion.display_name)
    setSuggestions([])
    setShowSuggestions(false)
    setStep(2)
  }

  // user clicks "Use my location" → GPS → fill form → go to step 2
  const getCurrentLocationHandler = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en", "User-Agent": "BingeEat App" } }
          )
          const data = await res.json()
          const addr = data.address
          setForm({
            house: addr.house_number || "",
            street: addr.road || addr.neighbourhood || "",
            city: addr.city || addr.town || addr.village || "",
            pincode: addr.postcode || "",
          })
          setSearchQuery(data.display_name)
          toast.success("Location detected!")
          setStep(2)
        } catch {
          toast.error("Failed to fetch address")
        } finally {
          setIsLocating(false)
        }
      },
      (err) => {
        toast.error("Location permission denied — please enable GPS")
        setIsLocating(false)
        console.log(err.message)
      }
    )
  }

  // save address and close modal
  const handleSave = async () => {
    if (!form.street || !form.city || !form.pincode) {
      toast.error("Please fill all required fields")
      return
    }
    const fullAddr = { ...form, label }
    setAddress(`${form.street}, ${form.city}`)
    setFullAddress(fullAddr)
    if (saveAddress) await saveToAccount(fullAddr)
    toast.success("Address saved!")
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 bg-soft text-dark flex flex-col gap-4">

        {/* STEP 1 — Search */}
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex gap-2 items-center">
                <MapPin size={18} className="text-[#E8450A]" />
                Select Your Location
              </DialogTitle>
            </DialogHeader>

            {/* GPS Button */}
            <Button
              onClick={getCurrentLocationHandler}
              disabled={isLocating}
              variant="outline"
              className="w-full justify-start gap-3 h-14 bg-cream border-dark hover:border-[#E8450A]/50 hover:bg-[#E8450A]/5 text-dark"
            >
              {isLocating
                ? <Loader2 size={18} className="text-[#E8450A] animate-spin" />
                : <Navigation size={18} className="text-[#E8450A]" />
              }
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  {isLocating ? "Detecting..." : "Use my current location"}
                </span>
                <span className="text-xs text-charcole">Uses your device GPS</span>
              </div>
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-dark/20" />
              <span className="text-xs text-dark/50">or search manually</span>
              <div className="flex-1 h-px bg-dark/20" />
            </div>

            {/* Search Input */}
            <div className="relative" onClick={e => e.stopPropagation()}>
              <div className="relative">
                <Input
                  placeholder="Search area, street, city..."
                  onChange={inputHandler}
                  onFocus={() => setShowSuggestions(true)}
                  value={searchQuery}
                  className="border-dark text-dark placeholder:text-charcole focus-visible:ring-[#E8450A]/30 pr-8"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setSuggestions([]) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-charcole hover:text-dark"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (suggestions.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-cream border border-dark/20 rounded-xl overflow-hidden shadow-xl">
                  {isSearching ? (
                    <div className="flex items-center gap-2 p-3 text-sm text-charcole">
                      <Loader2 size={14} className="animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSuggestion(s)}
                        className="w-full flex items-start gap-3 p-3 hover:bg-muted transition-colors text-left border-b border-dark/10 last:border-0"
                      >
                        <MapPin size={14} className="text-[#E8450A] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm text-dark line-clamp-1">
                            {s.display_name.split(",")[0]}
                          </div>
                          <div className="text-xs text-charcole line-clamp-1 mt-0.5">
                            {s.display_name.split(",").slice(1, 4).join(",")}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* STEP 2 — Form */}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex gap-2 items-center">
                <button
                  onClick={() => setStep(1)}
                  className="p-1 rounded-lg hover:bg-dark/10 transition-colors"
                >
                  <ArrowLeft size={18} className="text-dark" />
                </button>
                Confirm Address
              </DialogTitle>
            </DialogHeader>

            {/* Detected address preview */}
            <div className="flex items-start gap-2 p-3 bg-[#E8450A]/5 border border-[#E8450A]/20 rounded-xl">
              <MapPin size={14} className="text-[#E8450A] mt-0.5 shrink-0" />
              <p className="text-xs text-dark/70 line-clamp-2">{searchQuery}</p>
            </div>

            {/* Label selector */}
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map(l => (
                <button
                  key={l}
                  onClick={() => setLabel(l)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${label === l
                      ? "bg-[#E8450A] text-white"
                      : "border border-dark/20 text-dark/50 hover:border-dark/40"
                    }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Flat / House No / Building"
                value={form.house}
                onChange={e => setForm(prev => ({ ...prev, house: e.target.value }))}
                className="border-dark/20 text-dark placeholder:text-charcole focus-visible:ring-[#E8450A]/30"
              />
              <Input
                placeholder="Street / Area / Locality"
                value={form.street}
                onChange={e => setForm(prev => ({ ...prev, street: e.target.value }))}
                className="border-dark/20 text-dark placeholder:text-charcole focus-visible:ring-[#E8450A]/30"
              />
              <div className="flex gap-3">
                <Input
                  placeholder="City"
                  value={form.city}
                  onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
                  className="border-dark/20 text-dark placeholder:text-charcole focus-visible:ring-[#E8450A]/30"
                />
                <Input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={e => setForm(prev => ({ ...prev, pincode: e.target.value }))}
                  className="border-dark/20 text-dark placeholder:text-charcole focus-visible:ring-[#E8450A]/30 w-32"
                />
              </div>
            </div>

            {/* Save checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={e => setSaveAddress(e.target.checked)}
                className="accent-[#E8450A]"
              />
              <span className="text-xs text-dark/50">
                Save this address to my account
              </span>
            </label>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              className="w-full bg-[#E8450A] hover:bg-[#FF5500] text-white rounded-xl h-11 font-medium"
            >
              Save Address
            </Button>
          </>
        )}

      </DialogContent>
    </Dialog>
  )
}

export default LocationModal