import { AiOutlineLoading } from "react-icons/ai";


export default function Loader() 
{
    return (
        <div className="w-full h-full flex justify-center items-center">
          <AiOutlineLoading  className="text-[70px] animate-spin"/>
        </div>
    )
}