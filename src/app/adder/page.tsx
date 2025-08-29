"use client";
import { useState } from "react";


export default function Adder(){ 


   const [num1, setNum1] = useState(""); // for first textarea
  const [num2, setNum2] = useState(""); // for second textarea
  const [result, setResult] = useState("");
    return(
        <>
            <div className="container1">

                <div>
                    <textarea className="textBox" value= {num1}></textarea>
                </div>
                <div className="sign">
                    <p>+</p> 
                </div>
                <div>
                    <textarea className="textBox" value= {num2 }></textarea>
                </div>
                <div className="sign">
                    <p>=</p> 
                </div>
        
            </div>
            <div className="container2">

            </div>
        
        
        
        
        
        </>


    )


}