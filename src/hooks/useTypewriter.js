/* eslint-disable */
import { useState, useEffect } from "react";

export default function useTypewriter(text,speed=55,delay=0){
  const [displayed,setDisplayed]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    let i=0;setDisplayed("");setDone(false);
    const t1=setTimeout(()=>{
      const t=setInterval(()=>{
        if(i<=text.length){setDisplayed(text.slice(0,i));i++;}
        else{clearInterval(t);setDone(true);}
      },speed);
      return()=>clearInterval(t);
    },delay);
    return()=>clearTimeout(t1);
  },[text,delay]);
  return{displayed,done};
}