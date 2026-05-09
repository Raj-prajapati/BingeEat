import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import toast from "react-hot-toast";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const latestQuery = useRef("");
  const {
    searchAll,
    clearSearch,
  } = useSearchStore();

  const debounceSearch = useRef(null);

  const inputHandler = async (e) => {
    setIsSearching(true)
    try {
      const value = e.target.value;
      setQuery(value);
      if (value.length < 2) {
        setSuggestions([]);
        return;
      }
      if (debounceSearch.current) {
        clearTimeout(debounceSearch.current);
      }

      debounceSearch.current = setTimeout(async () => {
      latestQuery.current = value;
       const result= await searchAll(value);
        
         if (latestQuery.current !== value) return;
         const combinedResult=[...(result?.restaurants || []),...(result?.menuItems || [])]
         console.log(combinedResult)
        setSuggestions(combinedResult);
        setShowSuggestions(true);
       
      }, 600);
    } catch (error) {
      console.log(error.message);
      toast.error("Could not complete the search");
    } finally{
      setIsSearching(false)
    }
  };

  
  return (
    <div className="w-2/5 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark" />

      <Input
        placeholder="Search for restaurant or dish"
        value={query}
        onChange={inputHandler}
        className={
          "bg-white/5 border-dark text-dark  placeholder:text-charcole  w-full shadow-2xl h-12  flex-1 pr-8 pl-12 !text-base  hover:border-[#E8450A]/50 focus:bg-cream"
        }
      />
      {query && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark"
          onClick={() => {
            setQuery("");
            setShowSuggestions(false);
            
          }}
        >
          <X size={20} />
        </button>
      )}
       {showSuggestions && (suggestions.length>0 || isSearching )&&(
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-cream border border-dark rounded-xl overflow-hidden shadow-xl">
          {isSearching ?  (
                    <div className="flex items-center gap-2 p-3 text-sm text-charcole">
                      <Loader2 size={14} className="animate-spin" />
                      Searching...
                    </div>
                  ): suggestions.map((s,key)=>(
                      <button className="w-full flex items-start gap-3 p-3 hover:bg-muted transition-colors text-left border-b border-dark last:border-0 text-red-600"
                      key={key}
                      >
                       <div className="h-[60px] pl-5">
                        <div className="text-dark font-bold">{s.restaurantname}</div>
                        <span className="text-charcole">Restaurant</span>
                       </div>
                      </button>
                  ))
                  }
        </div>
       )}
       
    </div>
  );
};

export default SearchBar;
