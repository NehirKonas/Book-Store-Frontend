//the file name must exaclty be this

"use client";
import { usePathname } from "next/navigation";

export default function NotFound(){
    const pathName = usePathname();
    const productId=pathName.split("/")[2];
    const reviewId=pathName.split("/")[4];
    return(
        <div>
            <h2>Review {reviewId} of product {productId} not found </h2>


        </div>
    );
}