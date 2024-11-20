import React from 'react'
import deleteIcon from "../assets/delete.png"

export const Tag = ({keyWord, setFunction}) => {

    const handleRemoveWord = (word)=>{
        const words = keyWord.filter((key)=> key !== word)
        setFunction(words)
    }

  return (
    <div className={`flex flex-row flex-wrap gap-3 ps-2 items-center transition-all duration-500 ease-in-out ${keyWord?.length > 0 ? " opacity-100 h-[40px]" : "h-[0px] w-[0px] opacity-0"}`}>
        {
        keyWord?.map((item, index) => (
            <div className="flex gap-2 items-center h-[30px] p-2 bg-[#ECF3FF] rounded-lg text-[#3474EB] ">
            <p key={index}>{item}</p>
            <img src={deleteIcon} alt="delete-icon" width={"13px"} height={"10px"} className="cursor-pointer" onClick={()=>handleRemoveWord(item)}/>
            </div>
        ))
        }
    </div>
  )
}
