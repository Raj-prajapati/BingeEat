import {useState} from 'react'
import { MapPin } from 'lucide-react'
import { useAddressStore } from '@/store/addressStore'
import LocationModal from './LocationModal'
import { ChevronDown } from "lucide-react";




const Location = () => {

  const [openModal, setOpenModal]=useState(false)
  const address = useAddressStore((state) => state.address)
  

 const  onclickHandler=()=> setOpenModal(true)
  return (
    <>
    <div onClick={onclickHandler} className='ml-2 px-14 py-4 items-center  cursor-pointer shadow rounded-lg flex gap-7 hover:shadow-md hover:bg-pale hover:transition-all duration-150 hover:scale-[1.02] '>
        <span> <MapPin className='text-primary size-7'/></span>
         
         <div className='flex flex-col leading-tight'>
          <span className='text-sm text-gray'>Deliver To</span>
          <span className='font-medium text-base text-black flex gap-1'>{address ||"Select Location.." }<ChevronDown size={20} className='pt-1'/> </span>
         </div>
    </div>
     <LocationModal open={openModal} setOpen={setOpenModal} />
    </>
  )
}

export default Location